import { BoardCard } from "../../entities/BoardCard";
import { BoardColumn } from "../../entities/BoardColumn";
import { Request, Response } from "express";
import { v4 } from "uuid";
import { Board } from "../../entities/Board";
import { createQueryBuilder, getConnection } from "typeorm";

const getBaseColumnTemplate = async (boardid: number) => {
  const columns = [
    {
      name: "Column 1",
      cards: [
        {
          content: "Card 1 1",
        },
        {
          content: "Card 1 2",
        },
      ],
    },
    {
      name: "Column 2",
      cards: [
        {
          content: "Card 2 1",
        },
        {
          content: "Card 2 2",
        },
      ],
    },
  ];

  const boardCols = await Promise.all(
    columns.map(async (column) => {
      const boardToken = v4();
      const boardColumn = await BoardColumn.create({
        ...column,
        boardId: boardid,
        columnId: boardToken,
      }).save();
      const cards = await Promise.all(
        column.cards.map(async (card) => {
          const cardToken = v4();
          return await BoardCard.create({
            ...card,
            cardId: cardToken,
            columnId: boardColumn.id,
          }).save();
        })
      );
      return boardColumn;
    })
  );

  return boardCols;
};

export const createBoard = async (req: Request, res: Response) => {
  // Add validation
  const { name } = req.body;
  const boardId = v4();
  const board = await Board.create({
    name,
    boardId,
    creatorId: req.session.userId,
  }).save();

  console.log(board.id);
  const baseColumns = await getBaseColumnTemplate(board.id);

  board.columns = baseColumns;
  await board.save();

  res.json({ board });
};

export const getBoards = async (req: Request, res: Response) => {
  const boards = await Board.find({ where: { creatorId: req.session.userId } });
  return res.json({ boards });
};

export const getBoardFromId = async (req: Request, res: Response) => {
  const { id } = req.params;
  const replacements = [id];

  const columns = await getConnection().query(
    `
    select * from board_column as bc
      inner join board_card bcc on
      bcc."columnId"=bc.id
    where bc."boardId"=$1
    `,
    replacements
  );

  // Dont ask me how this works
  const parsedColumns: any[] = [];
  const foundIds: any = {};

  for (let i = 0; i < columns.length; ++i) {
    const { name, columnId, content, cardId } = columns[i];
    if (foundIds[columnId] !== undefined) {
      if (parsedColumns[foundIds[columnId]].cards) {
        parsedColumns[foundIds[columnId]].cards.push({ content, id: cardId });
      } else {
        parsedColumns[foundIds[columnId]].cards = [{ content, id: cardId }];
      }
    } else {
      parsedColumns[i] = { name, cards: [{ content, id: cardId }] };
      foundIds[columnId] = i;
    }
  }

  res.json({ columns: parsedColumns.filter((e) => e) });
};

export const deleteBoard = async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log("DELETE BOARD");
  const board = await Board.delete(id);
  res.json({ board });
};
