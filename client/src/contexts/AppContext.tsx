import React, { createContext, useReducer } from "react";
import { BoardActions, boardReducer } from "../reducers/BoardReducer";
import { InitialStateType, MainReducerActions } from "../reducers/types";
import { UserActions, userReducer } from "../reducers/UserReducer";

const initialState: InitialStateType = {
  board: {
    boardsLoading: false,
    currentBoardLoading: false,
  },
  user: {
    authenticated: false,
  },
};

const AppContext = createContext<{
  state: InitialStateType;
  dispatch: React.Dispatch<any>;
}>({ state: initialState, dispatch: () => null });

const mainReducer = (
  { board, user }: InitialStateType,
  action: MainReducerActions
) => ({
  board: boardReducer(board, action as BoardActions),
  user: userReducer(user, action as UserActions),
});

const AppProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(mainReducer, initialState);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
