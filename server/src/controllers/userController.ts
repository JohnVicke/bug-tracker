import { User } from "../entities/User";
import { Request, Response } from "express";
import { getConnection } from "typeorm";
import argon2 from "argon2";

export const register = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  // run validation
  const hashedPassowrd = await argon2.hash(password);
  let user;
  try {
    const res = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(User)
      .values({
        username,
        password: hashedPassowrd,
      })
      .returning("*")
      .execute();
    user = res.raw[0];
  } catch (err) {
    if (err.code === "23505") {
      res.json({
        error: {
          field: "username",
          message: "username is already taken",
        },
      });
    }
  }
  req.session.userId = user.id;
  res.json(userResponse(user));
};

const userResponse = (user: User) => {
  const { password, id, ...rest } = user;
  return { user: { ...rest } };
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = await User.findOne({
    where: { username },
  });
  if (!user) {
    // no user
    return res.json({
      error: { field: "username", message: "user does not exist" },
    });
  }

  const validPassword = await argon2.verify(user.password, password);

  if (!validPassword) {
    return res.json({
      error: {
        field: "password",
        message: "incorrect password",
      },
    });
  }
  req.session.userId = user.id;
  return res.json(userResponse(user));
};

export const me = async (req: Request, res: Response) => {
  console.log(req.session.userId);
  if (!req.session.userId) {
    return res.send({ error: "hihi" });
  }
  const user = await User.findOne(req.session.userId);
  if (!user)
    return res.json({ error: { message: "oops something went wrong" } });
  return res.json(userResponse(user));
};
