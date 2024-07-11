import { ApiProperty } from "@nestjs/swagger";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { BorrowedBook } from "./borrowed-book.entity";

@Entity()
export class Book {
  @ApiProperty({
    description: "The unique identifier of the book",
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: "The unique code of the book",
    example: "123ABC",
  })
  @Column({ type: "varchar", length: 100, nullable: false, unique: true })
  code: string;

  @ApiProperty({
    description: "The title of the book",
    example: "NestJS Basics",
  })
  @Column({ type: "varchar", length: 100, nullable: false })
  title: string;

  @ApiProperty({
    description: "The author of the book",
    example: "John Doe",
  })
  @Column({ type: "varchar", length: 100, nullable: false })
  author: string;

  @ApiProperty({
    description: "The member who borrowed the book",
    type: () => BorrowedBook,
  })
  @OneToOne(() => BorrowedBook, (borrowedBook) => borrowedBook.book, { onDelete: "SET NULL" })
  @JoinColumn({ name: "borrowed_by_id", referencedColumnName: "id" })
  borrowed_by: BorrowedBook;

  @ApiProperty({ description: "The member id who borrowed the book", example: 1 })
  @Column({ nullable: true })
  borrowed_by_id: number;

  @ApiProperty({
    description: "The date and time when the book was created",
    example: "2024-01-01T00:00:00.000Z",
  })
  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  created_at: Date;

  @ApiProperty({
    description: "The date and time when the book was last updated",
    example: "2024-01-01T00:00:00.000Z",
  })
  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
    onUpdate: "CURRENT_TIMESTAMP(6)",
  })
  updated_at: Date;
}
