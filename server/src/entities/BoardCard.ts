import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { BoardColumn } from "./BoardColumn";

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
export class BoardCard extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => BoardColumn, (column) => column.cards, {
    onDelete: "CASCADE",
  })
  column: BoardColumn;

  @Column()
  columnId: number;

  @Column()
  cardId: string;

  @Column()
  content: string;

  @CreateDateColumn()
  createdAt = Date();

  @UpdateDateColumn()
  updatedAt = Date();
}
