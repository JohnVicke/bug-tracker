import {
  createBoard,
  deleteBoard,
  getBoardFromId,
  getBoards,
  insertColumn,
} from "../controllers/board";
import express from "express";

const router = express.Router();

router.post("/", createBoard);
router.get("/", getBoards);
router.get("/:id", getBoardFromId);
router.put("/:id", deleteBoard);
router.post("/column/:boardId", insertColumn);

export { router as boardRouter };
