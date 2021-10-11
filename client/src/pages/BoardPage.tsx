import React, { useContext, useEffect, useState } from "react";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { RouteComponentProps, useHistory } from "react-router";
import { BoardColumns } from "../components/Board/BoardColumns";
import { useBoard } from "../actions/BoardActions";
import { AppContext } from "../contexts/AppContext";
import { Button, IconButton, Tooltip } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

interface MatchParams {
  id: string;
}

interface BoardPageProps extends RouteComponentProps<MatchParams> {}

export const BoardPage: React.FC<BoardPageProps> = ({
  match: {
    params: { id },
  },
}) => {
  const history = useHistory();
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);

  const { getBoardFromIdAction } = useBoard();

  const {
    state: { board },
  } = useContext(AppContext);

  const toggleMenu = () => {
    setIsMenuCollapsed(!isMenuCollapsed);
  };

  useEffect(() => {
    getBoardFromIdAction(parseInt(id, 10));
  }, []);
  console.log("[BOARDCOLUMNS]:", board.currentBoard);

  return (
    <Flex flexDir="row" height="100vh">
      {isMenuCollapsed ? (
        <Flex
          paddingX="4"
          paddingY="3"
          justifyContent="center"
          overflow="hidden"
          background="gray.900"
          position="sticky"
          left="0"
        >
          <Tooltip label="Collapse menu">
            <IconButton
              aria-label="Collapse menu"
              onClick={toggleMenu}
              icon={<ChevronRightIcon />}
              size="md"
            />
          </Tooltip>
        </Flex>
      ) : (
        <Box
          overflow="hidden"
          minWidth="260px"
          background="gray.900"
          position="sticky"
          left="0"
        >
          <Flex justifyContent="space-between" alignItems="center" padding="4">
            <Button
              variant="link"
              fontWeight="bold"
              onClick={() => history.push("/boards")}
            >
              Home
            </Button>
            <Tooltip label="Collapse menu">
              <IconButton
                aria-label="Collapse menu"
                onClick={toggleMenu}
                icon={<ChevronLeftIcon />}
                size="md"
              />
            </Tooltip>
          </Flex>
        </Box>
      )}
      <Box overflow="auto">
        {board.currentBoard?.columns && (
          <>
            <Box padding="2">
              <BoardColumns />
            </Box>
          </>
        )}
      </Box>
    </Flex>
  );
};
