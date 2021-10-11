import { Flex } from "@chakra-ui/layout";
import React, { useContext, useEffect, useState } from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { useBoard } from "../../actions/BoardActions";
import { AppContext } from "../../contexts/AppContext";
import { BoardRow } from "./BoardRow";

interface BoardColumnsProps {}

export const BoardColumns: React.FC<BoardColumnsProps> = () => {
  const {
    state: {
      board: { currentBoard },
    },
  } = useContext(AppContext);
  const { moveCardAction, rearrangeCardAction } = useBoard();

  const move = (
    sourceListId: string,
    destListId: string,
    start: number,
    end: number
  ) => {
    // TODO: Move all this into action controllelr
    if (!currentBoard) return;
    const { columns } = currentBoard;
    if (!columns) return;
    const sourceArrayIndex = columns?.findIndex(
      (column) => column.id === sourceListId
    );
    const destArrayIndex = columns?.findIndex(
      (column) => column.id === destListId
    );
    const src = columns[sourceArrayIndex];
    const dest = columns[destArrayIndex];
    if (!src || !dest) return;

    const srcCardArray = Array.from(src.cards);
    const destCardArray = Array.from(dest.cards);
    const [removed] = srcCardArray.splice(start, 1);
    destCardArray.splice(end, 0, removed);
    // update columns
    moveCardAction({
      sourceArrayIndex,
      destArrayIndex,
      destCardArray,
      srcCardArray,
    });
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    const sInd = source.droppableId;
    const dInd = destination.droppableId;
    if (sInd === dInd) {
      if (destination.index === source.index) return;
      // in same col
      rearrangeCardAction({
        listId: sInd,
        start: source.index,
        end: destination.index,
      });
    } else {
      // in different col
      move(sInd, dInd, source.index, destination.index);
    }
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Flex overflowX="visible">
        {currentBoard?.columns &&
          currentBoard.columns.map((column, i) => (
            <BoardRow column={column} key={i} index={i} />
          ))}
      </Flex>
    </DragDropContext>
  );
};
