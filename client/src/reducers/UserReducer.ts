import { User } from "../types/user";
import { ActionMap } from "./types";

export enum Types {
  Login = "LOGIN",
  LoginError = "LOGIN_ERROR",
}

type UserPayload = {
  [Types.Login]: {
    username: string;
  };
  [Types.LoginError]: {
    error: Error;
  };
};

export type UserActions = ActionMap<UserPayload>[keyof ActionMap<UserPayload>];

export const userReducer = (state: User, action: UserActions) => {
  switch (action.type) {
    case Types.Login:
      console.log(action.payload);
      return {
        ...state,
        ...action.payload,
        authenticated: true,
      };
    case Types.LoginError:
      return {
        ...state,
        loginError: action.payload.error,
      };
    default:
      return state;
  }
};
