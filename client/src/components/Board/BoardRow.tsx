import React, { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Flex, Text } from "@chakra-ui/layout";
import { Box, IconButton, Tooltip } from "@chakra-ui/react";
import { Droppable } from "react-beautiful-dnd";
import { BoardCard } from "./BoardCard";

import { Column } from "./types";

interface BoardColumnProps {
  column: Column;
  index: number;
}

export const BoardRow: React.FC<BoardColumnProps> = ({ column, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const { name } = column;

  const collapseColumn = () => {
    if (isExpanded) return setIsExpanded(false);
    setIsCollapsed(true);
  };

  const expandColumn = () => {
    if (isCollapsed) return setIsCollapsed(false);
    setIsExpanded(true);
  };

  interface ExpandButtonProps {
    size: string;
  }

  const ExpandButton = ({ size }: ExpandButtonProps) => (
    <Tooltip label="Expand column">
      <IconButton
        disabled={isExpanded}
        onClick={expandColumn}
        aria-label="Expand column"
        icon={<ChevronRightIcon />}
        size={size}
      />
    </Tooltip>
  );

  if (isCollapsed) {
    return (
      <Flex margin="1" flexDir="column" alignItems="center">
        <ExpandButton size="md" />
        <Text
          marginTop="5"
          style={{ textOrientation: "mixed", writingMode: "vertical-rl" }}
          fontSize="l"
          fontWeight="bold"
        >
          {name}
        </Text>
        <Text
          marginTop="5"
          style={{ textOrientation: "mixed", writingMode: "vertical-rl" }}
          fontSize="l"
        >
          {column.cards.length} issues
        </Text>
      </Flex>
    );
  }

  return (
    <Box margin="1">
      <Flex
        overflow="hidden"
        width={isExpanded ? "520px" : "260px"}
        flexDir="column"
        background="gray.700"
        borderRadius="5"
        padding="3"
        transition="width 0.1s ease-out"
      >
        <Flex width="100%" justifyContent="space-between">
          <Text fontSize="l" fontWeight="bold">
            {name}
          </Text>
          <Box>
            <Tooltip label="Collapse column">
              <IconButton
                onClick={collapseColumn}
                aria-label="Collapse column"
                icon={<ChevronLeftIcon />}
                size="s"
                marginRight="2"
              />
            </Tooltip>
            <ExpandButton size="s" />
          </Box>
        </Flex>
        <Flex
          overflowY="auto"
          overflowX="hidden"
          flexDir="column"
          marginTop="2"
        >
          {column.cards && (
            <Droppable droppableId={`cardList-${column.id}`}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    minHeight: "100px",
                    maxHeight: "80vh",
                    overflowX: "hidden",
                  }}
                >
                  {column.cards.map((card, index) => (
                    <BoardCard card={card} index={index} key={card.id} />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};
