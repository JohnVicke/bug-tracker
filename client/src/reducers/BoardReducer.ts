import { Column } from "../components/Board/types";
import { ActionMap, BoardState } from "./types";

export enum Types {
  UpdateBoard = "UPDATE_BOARD",
  BoardsFetched = "FETCH_BOARD",
  MoveCard = "MOVE_CARD",
  RearrangeCard = "REARRANGE_CARD",
  CurrentBoardFetched = "CURRENT_BOARD_FETCHED",
  StartFetchingBoards = "START_FETCHING_BOARDS",
  StartFetchingCurrentBoard = "START_FETCHING_CURRENT_BOARD",
  DeleteBoard = "UPDATE_BOARDS",
  AddBoard = "ADD_BOARD",
  AddColumn = "ADD_COLUMN",
}

export type Board = {
  name: string;
  id: number;
  columns?: Column[];
  fetched?: boolean;
  loading?: boolean;
  updated?: boolean;
};

type BoardPayload = {
  [Types.UpdateBoard]: {
    board: Board;
  };
  [Types.BoardsFetched]: {
    boards: Board[];
  };
  [Types.MoveCard]: {
    columns: Column[];
  };
  [Types.RearrangeCard]: {
    columns: Column[];
  };
  [Types.CurrentBoardFetched]: {
    board: Board;
  };
  [Types.StartFetchingBoards]: {};
  [Types.StartFetchingCurrentBoard]: {};
  [Types.DeleteBoard]: {
    id: number;
  };
  [Types.AddBoard]: {
    board: Board;
  };
  [Types.AddColumn]: {
    column: Column;
  };
};

export type BoardActions =
  ActionMap<BoardPayload>[keyof ActionMap<BoardPayload>];

export const boardReducer = (
  state: BoardState,
  action: BoardActions
): BoardState => {
  switch (action.type) {
    case Types.UpdateBoard:
      return {
        ...state,
      };
    case Types.StartFetchingBoards:
      return {
        ...state,
      };
    case Types.BoardsFetched:
      return {
        ...state,
        boardsOveriew: action.payload.boards,
      };
    case Types.MoveCard:
      if (!state.currentBoard) return { ...state };
      return {
        ...state,
        currentBoard: {
          ...state.currentBoard,
          columns: action.payload.columns,
        },
        //columns: action.payload.columns
        //? action.payload.columns
        //: state.currentBoard.columns,
      };
    case Types.RearrangeCard:
      if (!state.currentBoard) return { ...state };
      return {
        ...state,
        //columns: action.payload.columns
        //? action.payload.columns
        //: state.currentBoard.columns,
      };
    case Types.CurrentBoardFetched:
      return {
        ...state,
        currentBoard: action.payload.board,
      };
    case Types.DeleteBoard:
      if (!action.payload.id) {
        return state;
      }
      return {
        ...state,
        boardsOveriew: state.boardsOveriew?.filter(
          (board) => board.id !== action.payload.id
        ),
      };

    case Types.AddBoard:
      const { board } = action.payload;
      if (!state.boardsOveriew) {
        return state;
      }
      console.log([...state.boardsOveriew, board]);
      return {
        ...state,
        boardsOveriew: [...state.boardsOveriew, { ...board }],
      };
    case Types.AddColumn:
      const { column } = action.payload;
      if (!state.currentBoard?.columns || !column) return state;
      console.log(column);
      console.log([...state.currentBoard.columns, column]);
      return {
        ...state,
        currentBoard: {
          ...state.currentBoard,
          columns: [...state.currentBoard.columns, column],
        },
      };
    default:
      return state;
  }
};
