export type User = {
  username?: string;
  authenticated?: boolean;
  loginError?: Error;
};

export type UserLogin = {
  username: string;
  password: string;
};
