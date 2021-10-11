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
  UpdateBoards = "UPDATE_BOARDS",
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
  [Types.UpdateBoards]: {
    id: number;
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
    case Types.UpdateBoards:
      if (!action.payload.id) {
        return state;
      }
      return {
        ...state,
        boardsOveriew: state.boardsOveriew?.filter(
          (board) => board.id !== action.payload.id
        ),
      };
    default:
      return state;
  }
};
