import { useContext } from "react";
import {
  addBoardColumn,
  createBoard,
  deleteBoardFromId,
  getBoardFromId,
  getBoards,
} from "../adapters/api";
import { Card } from "../components/Board/types";
import { AppContext } from "../contexts/AppContext";
import { Types } from "../reducers/BoardReducer";

type MoveCardParams = {
  sourceArrayIndex: number;
  destArrayIndex: number;
  srcCardArray: Card[];
  destCardArray: Card[];
};

type RearrangeCardParams = {
  listId: string;
  start: number;
  end: number;
};

export const useBoard = () => {
  const { state, dispatch } = useContext(AppContext);

  const getBoardsAction = async () => {
    dispatch({
      type: Types.StartFetchingBoards,
    });

    const { data } = await getBoards();
    console.log(data);

    dispatch({
      type: Types.BoardsFetched,
      payload: {
        boards: (data as any).boards,
      },
    });
  };

  const deleteBoard = async (id: number) => {
    const { data } = await deleteBoardFromId(id);
    dispatch({
      type: Types.DeleteBoard,
      payload: { id },
    });
  };

  const addBoard = async ({ name }: { name: string }) => {
    const { data } = await createBoard({ name });
    dispatch({
      type: Types.AddBoard,
      payload: {
        board: data.board,
      },
    });
  };

  const getBoardFromIdAction = async (id: number) => {
    dispatch({
      type: Types.StartFetchingBoards,
    });

    const { data } = await getBoardFromId(id);

    const currentBoard = state.board.boardsOveriew?.find(
      (board) => board.id === id
    );

    dispatch({
      type: Types.CurrentBoardFetched,
      payload: {
        board: {
          ...currentBoard,
          columns: (data as any).columns,
        },
      },
    });
  };

  const moveCardAction = ({
    sourceArrayIndex,
    destArrayIndex,
    srcCardArray,
    destCardArray,
  }: MoveCardParams) => {
    if (!state?.board?.currentBoard?.columns) return;

    const columnsCopy = Array.from(state.board.currentBoard.columns);
    const sourceCopy = {
      ...state.board.currentBoard.columns[sourceArrayIndex],
    };
    const destCopy = { ...state.board.currentBoard.columns[destArrayIndex] };

    columnsCopy[sourceArrayIndex] = { ...sourceCopy, cards: srcCardArray };
    columnsCopy[destArrayIndex] = { ...destCopy, cards: destCardArray };

    // TODO: Persist order through backend
    dispatch({
      type: Types.MoveCard,
      payload: { columns: columnsCopy },
    });
  };

  const rearrangeCardAction = ({ listId, start, end }: RearrangeCardParams) => {
    if (!state?.board?.currentBoard?.columns) return;
    const currentArrIndex = state.board.currentBoard.columns.findIndex(
      (column) => `cardList-${column.id}` === listId
    );

    const columnCopy = Array.from(state.board.currentBoard.columns);
    const { cards, ...rest } = columnCopy[currentArrIndex];
    const [removed] = cards.splice(start, 1);
    cards.splice(end, 0, removed);
    columnCopy[currentArrIndex] = { ...rest, cards };
    // TODO: Persist order through backend
    dispatch({
      type: Types.RearrangeCard,
      payload: { columns: columnCopy },
    });
  };

  const addColumn = async (name: string, id: number) => {
    if (!id) return console.error("no id");
    const {
      data: { boardColumn },
    } = await addBoardColumn(name, id);
    dispatch({
      type: Types.AddColumn,
      payload: { column: boardColumn, id },
    });
  };

  return {
    getBoardsAction,
    moveCardAction,
    rearrangeCardAction,
    getBoardFromIdAction,
    deleteBoard,
    addBoard,
    addColumn,
  };
};
