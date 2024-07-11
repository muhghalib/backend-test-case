import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  OneToOne,
  AfterInsert,
  AfterUpdate,
} from "typeorm";
import { Member } from "./member.entity";
import { Book } from "./book.entity";
import { ApiProperty } from "@nestjs/swagger";
import { getRepositoryToken } from "@nestjs/typeorm";

@Entity()
export class BorrowedBook {
  @ApiProperty({
    description: "Unique identifier of the borrowed book record",
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: "The member who borrowed the book",
    type: () => Member,
  })
  @ManyToOne(() => Member, (member) => member.borrowed_books, { onUpdate: "CASCADE" })
  @JoinColumn({ name: "member_id" })
  member: Member;

  @ApiProperty({
    description: "The ID of the member who borrowed the book",
    example: 1,
  })
  @Column()
  member_id: number;

  @ApiProperty({
    description: "The borrowed book details",
    type: () => Book,
  })
  @OneToOne(() => Book, (book) => book.borrowed_by, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  @JoinColumn({ name: "book_id" })
  book: Book;

  @ApiProperty({
    description: "The ID of the borrowed book",
    example: 1,
  })
  @Column()
  book_id: number;

  @ApiProperty({
    description: "The date by which the borrowed book should be returned",
    example: "2024-07-20T12:00:00Z",
    type: "string",
    format: "date-time",
  })
  @Column({ type: "timestamp" })
  return_date: Date;
}
