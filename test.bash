#!/usr/bin/env bash

# This script builds on the excellent work by Lucas Jenß, described in his blog
# post "Integrating a submodule into the parent repository", but automates the
# entire process and cleans up a few other corner cases.
# https://x3ro.de/2013/09/01/Integrating-a-submodule-into-the-parent-repository.html

function usage() {
  echo "Merge a submodule into a repo, retaining file history."
  echo "Usage: $0 <submodule-name>"
  echo ""
  echo "options:"
  echo "  -h, --help                Print this message"
  echo "  -v, --verbose             Display verbose output"
}

function abort {
    echo "$(tput setaf 1)$1$(tput sgr0)"
    exit 1
}

function request_confirmation {
    read -p "$(tput setaf 4)$1 (y/n) $(tput sgr0)"
    [ "$REPLY" == "y" ] || abort "Aborted!"
}

function warn() {
  cat << EOF
    This script will convert your "${sub}" git submodule into
    a simple subdirectory in the parent repository while retaining all
    contents and file history.

    The script will:
      * delete the ${sub} submodule configuration from .gitmodules and
        .git/config and commit it.
      * rewrite the entire history of the ${sub} submodule so that all
        paths are prefixed by ${path}.
        This ensures that git log will correctly follow the original file
        history.
      * merge the submodule into its parent repository and commit it.

    NOTE: This script might completely garble your repository, so PLEASE apply
    this only to a fresh clone of the repository where it does not matter if
    the repo is destroyed.  It would be wise to keep a backup clone of your
    repository, so that you can reconstitute it if need be.  You have been
    warned.  Use at your own risk.

EOF

  request_confirmation "Do you want to proceed?"
}

function git_version_lte() {
  OP_VERSION=$(printf "%03d%03d%03d%03d" $(echo "$1" | tr '.' '\n' | head -n 4))
  GIT_VERSION=$(git version)
  GIT_VERSION=$(printf "%03d%03d%03d%03d" $(echo "${GIT_VERSION#git version}" | tr '.' '\n' | head -n 4))
  echo -e "${GIT_VERSION}\n${OP_VERSION}" | sort | head -n1
  [ ${OP_VERSION} -le ${GIT_VERSION} ]
}

function main() {

  warn

  if [ "${verbose}" == "true" ]; then
    set -x
  fi

  # Remove submodule and commit
  git config -f .gitmodules --remove-section "submodule.${sub}"
  if git config -f .git/config --get "submodule.${sub}.url"; then
    git config -f .git/config --remove-section "submodule.${sub}"
  fi
  rm -rf "${path}"
  git add -A .
  git commit -m "Remove submodule ${sub}"
  rm -rf ".git/modules/${sub}"

  # Rewrite submodule history
  local tmpdir="$(mktemp -d -t submodule-rewrite-XXXXXX)"
  git clone "${url}" "${tmpdir}"
  pushd "${tmpdir}"
  local tab="$(printf '\t')"
  local filter="git ls-files -s | sed \"s/${tab}/${tab}${path}\//\" | GIT_INDEX_FILE=\${GIT_INDEX_FILE}.new git update-index --index-info && mv \${GIT_INDEX_FILE}.new \${GIT_INDEX_FILE}"
  git filter-branch --index-filter "${filter}" HEAD
  popd

  # Merge in rewritten submodule history
  git remote add "${sub}" "${tmpdir}"
  git fetch "${sub}"

  if git_version_lte 2.8.4
  then
    # Previous to git 2.9.0 the parameter would yield an error
    ALLOW_UNRELATED_HISTORIES=""
  else
    # From git 2.9.0 this parameter is required
    ALLOW_UNRELATED_HISTORIES="--allow-unrelated-histories"
  fi

  git merge -s ours --no-commit ${ALLOW_UNRELATED_HISTORIES} "${sub}/master"
  rm -rf tmpdir

  # Add submodule content
  git clone "${url}" "${path}"
  rm -rf "${path}/.git"
  git add "${path}"
  git commit -m "Merge submodule contents for ${sub}"
  git config -f .git/config --remove-section "remote.${sub}"

  set +x
  echo "$(tput setaf 2)Submodule merge complete. Push changes after review.$(tput sgr0)"
}

set -euo pipefail

declare verbose=false
while [ $# -gt 0 ]; do
    case "$1" in
        (-h|--help)
            usage
            exit 0
            ;;
        (-v|--verbose)
            verbose=true
            ;;
        (*)
            break
            ;;
    esac
    shift
done

declare sub="${1:-}"

if [ -z "${sub}" ]; then
  >&2 echo "Error: No submodule specified"
  usage
  exit 1
fi

shift

if [ -n "${1:-}" ]; then
  >&2 echo "Error: Unknown option: ${1:-}"
  usage
  exit 1
fi

if ! [ -d ".git" ]; then
  >&2 echo "Error: No git repository found.  Must be run from the root of a git repository"
  usage
  exit 1
fi

declare path="$(git config -f .gitmodules --get "submodule.${sub}.path")"
declare url="$(git config -f .gitmodules --get "submodule.${sub}.url")"

if [ -z "${path}" ]; then
  >&2 echo "Error: Submodule not found: ${sub}"
  usage
  exit 1
fi

if ! [ -d "${path}" ]; then
  >&2 echo "Error: Submodule path not found: ${path}"
  usage
  exit 1
fi

main
