import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Board } from "./Board";
import { BoardCard } from "./BoardCard";

// Setup database to handle Board type
/**
 * name: string
 * id: number
 * boardId: string
 * columns: [
 *  {
 *    name: string,
 *    content: string,
 *    id: number
 *  }
 * ]
 */
@Entity()
export class BoardColumn extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Board, (board) => board.columns, { onDelete: "CASCADE" })
  board: Board;

  @Column()
  boardId: number;

  @OneToMany(() => BoardCard, (card) => card.column, { onDelete: "CASCADE" })
  cards: BoardCard[];

  @Column()
  columnId: string;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt = Date();

  @UpdateDateColumn()
  updatedAt = Date();
}
