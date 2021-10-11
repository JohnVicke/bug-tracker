import axios, { AxiosResponse } from "axios";
import { Column } from "../components/Board/types";
import { Board } from "../reducers/BoardReducer";
import { User, UserLogin } from "../types/user";

const baseURL = "http://localhost:42069/api/v1/";

const defaults = {
  baseURL,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": baseURL,
  },
  withCredentials: true,
};

type UserResponse = {
  user: User;
};

type CreateBoardOptions = {
  name: string;
};

type AxiosUserResponse = AxiosResponse<UserResponse>;

export const postLogin = (userCredentials: UserLogin) => {
  return axios.post<UserLogin, AxiosUserResponse>(
    "/user/login",
    userCredentials,
    defaults
  );
};

export const getMe = () => {
  return axios.get<UserResponse>("/user/me", defaults);
};

export const createBoard = (boardOptions: CreateBoardOptions) => {
  return axios.post<CreateBoardOptions, AxiosResponse<{ board: Board }>>(
    "/board",
    boardOptions,
    defaults
  );
};

export const getBoards = () => {
  return axios.get("/board", defaults);
};

export const getBoardFromId = (id: number) => {
  return axios.get(`/board/${id}`, defaults);
};

export const deleteBoardFromId = (id: number) => {
  return axios.put(`${baseURL}board/${id}`, defaults, {
    withCredentials: true,
  });
};

type AddBoardOptions = {
  name: string;
};

export const addBoardColumn = (name: string, id: number) => {
  return axios.post<AddBoardOptions, AxiosResponse<{ boardColumn: Column }>>(
    `/board/column/${id}`,
    { name },
    defaults
  );
};
