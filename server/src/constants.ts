import dotenv from "dotenv";
dotenv.config();
export const PORT = process.env.PORT || 42069;
export const __prod__ = process.env.NODE_ENV === "prod";
