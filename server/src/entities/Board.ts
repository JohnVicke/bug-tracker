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
import { BoardColumn } from "./BoardColumn";
import { User } from "./User";

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
export class Board extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.boards)
  creator: User;

  @OneToMany(() => BoardColumn, (column) => column.board, {
    onDelete: "CASCADE",
  })
  columns: BoardColumn[];

  @Column()
  creatorId: number;

  @Column({ unique: true })
  boardId: string;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt = Date();

  @UpdateDateColumn()
  updatedAt = Date();
}
