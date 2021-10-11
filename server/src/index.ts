import express from "express";
import dotenv from "dotenv";
import session from "express-session";
import connectRedis from "connect-redis";
import Redis from "ioredis";
import path from "path";
import { createConnection } from "typeorm";
import cors from "cors";

import { PORT, __prod__ } from "./constants";
import { User } from "./entities/User";
import { Board } from "./entities/Board";
import { BoardCard } from "./entities/BoardCard";
import { BoardColumn } from "./entities/BoardColumn";
import { userRouter } from "./routes/userRouter";
import { boardRouter } from "./routes/boardRouter";
import { isAuth } from "./middlewares/isAuth";

dotenv.config();

const COOKIE_NAME = process.env.COOKIE_NAME || "qid";
const REDIS_SECRET = process.env.REDIS_SECRET || "muchSecret";

(async () => {
  const app = express();
  app.set("proxy", 1);

  await createConnection({
    type: "postgres",
    url: process.env.DATABASE_URL,
    logging: true,
    synchronize: true,
    entities: [User, Board, BoardColumn, BoardCard],
    migrations: [path.join(__dirname, "./migrations/*")],
  });

  const RedisStore = connectRedis(session);
  const redis = new Redis(process.env.REDIS_URL);

  app.use(
    cors({
      credentials: true,
      origin: "http://localhost:3000",
      methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
    })
  );
  console.log("PROD: ", __prod__);
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        secure: __prod__,
        path: "/",
        sameSite: "lax",
      },
      secret: REDIS_SECRET,
      resave: false,
    })
  );

  app.get("/api/v1", (_, res) =>
    res.json({ version: 1, bugtracker: "hello world" })
  );
  app.use("/api/v1/user", userRouter);
  app.use("/api/v1/board", isAuth, boardRouter);

  app.listen(PORT, () =>
    console.log(
      `Server running in ${
        __prod__ ? "production" : "development"
      } mode on port ${PORT}`
    )
  );
})().catch((err) => console.error(err));
