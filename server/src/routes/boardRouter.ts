import {
  createBoard,
  deleteBoard,
  getBoardFromId,
  getBoards,
} from "../controllers/board";
import express from "express";

const router = express.Router();

router.post("/", createBoard);
router.get("/", getBoards);
router.get("/:id", getBoardFromId);
router.put("/:id", deleteBoard);

export { router as boardRouter };
