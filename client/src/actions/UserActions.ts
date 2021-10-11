import { useContext } from "react";
import { postLogin, getMe } from "../adapters/api";
import { AppContext } from "../contexts/AppContext";
import { Types } from "../reducers/UserReducer";
import { UserLogin } from "../types/user";

export const UserActions = () => {
  const { state, dispatch } = useContext(AppContext);

  const login = async ({ username, password }: UserLogin) => {
    try {
      const { data } = await postLogin({ username, password });
      dispatch({
        type: Types.Login,
        payload: {
          username: data.user.username,
        },
      });
      return true;
    } catch (error) {
      dispatch({
        type: Types.LoginError,
        payload: {
          error,
        },
      });
      return false;
    }
  };

  const me = async () => {
    try {
      const { data } = await getMe();
      if (data) {
        dispatch({
          type: Types.Login,
          payload: {
            username: data.user.username,
          },
        });
        return true;
      }
    } catch (error) {
      dispatch({
        type: Types.LoginError,
        payload: {
          error,
        },
      });
      return false;
    }
  };

  return { login, me };
};
