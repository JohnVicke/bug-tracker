import { Box, Flex } from "@chakra-ui/react";
import React from "react";

interface NavbarProps {}

const leftSideMenuItems = [
  { type: "menu", name: "workspaces", menuItems: [] },
  { type: "button", name: "create" },
];
const rightSideMenuItems = [{ type: "search" }];

export const Navbar: React.FC<NavbarProps> = ({}) => {
  return <Flex></Flex>;
};
