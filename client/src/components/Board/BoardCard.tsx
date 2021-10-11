import React from "react";
import { Box } from "@chakra-ui/react";
import { Draggable } from "react-beautiful-dnd";
import { Card } from "./types";

interface BoardCardProps {
  card: Card;
  index: number;
}

export const BoardCard: React.FC<BoardCardProps> = ({ card, index }) => {
  const { content, id } = card;

  return (
    <Draggable draggableId={`cardId-${(id + 1).toString()}`} index={index}>
      {(provided, snapshot) => (
        <Box
          style={{ transition: "width 0.2s ease-out" }}
          overflow="hidden"
          ref={provided.innerRef}
          {...provided.dragHandleProps}
          {...provided.draggableProps}
        >
          <Box
            background="gray.900"
            borderRadius="5"
            padding="2"
            marginY="1"
            style={{
              transition: "transform 0.2s ease-in-out",
              transform: snapshot.isDragging ? "scale(0.95)" : "scale(1)",
            }}
          >
            {content}
          </Box>
        </Box>
      )}
    </Draggable>
  );
};
