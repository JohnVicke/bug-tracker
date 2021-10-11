import express from "express";

import { login, me, register } from "../controllers/userController";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", me);

export { router as userRouter };
