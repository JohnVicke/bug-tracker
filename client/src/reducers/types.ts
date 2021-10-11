import { User } from "../types/user";
import { Board, BoardActions } from "./BoardReducer";
import { UserActions } from "./UserReducer";

export type BoardState = {
  boardsOveriew?: Board[];
  currentBoard?: Board;
  boardsLoading: boolean;
  currentBoardLoading: boolean;
};

export type InitialStateType = {
  board: BoardState;
  user: User;
};

export type MainReducerActions = BoardActions | UserActions;

export type ActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};
