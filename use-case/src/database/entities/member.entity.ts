import { ApiProperty } from "@nestjs/swagger";
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { BorrowedBook } from "./borrowed-book.entity";

@Entity()
export class Member {
  @ApiProperty({
    description: "The unique identifier of the member",
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: "The unique code of the member",
    example: "MEM123",
  })
  @Column({ type: "varchar", length: 100, nullable: false, unique: true })
  code: string;

  @ApiProperty({
    description: "The name of the member",
    example: "John Doe",
  })
  @Column({ type: "varchar", length: 100, nullable: false })
  name: string;

  @ApiProperty({
    description: "The expired date of member that being punished",
    example: null,
  })
  @Column({ type: "date", nullable: true })
  penalty_exp_date: string;

  @ApiProperty({
    description: "The list of books borrowed by the member",
    type: () => [BorrowedBook],
    example: [
      {
        id: 1,
        member_id: 1,
        book_id: 1,
        return_date: new Date(),
      },
    ],
  })
  @OneToMany(() => BorrowedBook, (borrowedBook) => borrowedBook.member)
  borrowed_books: BorrowedBook[];

  @ApiProperty({
    description: "The date and time when the member was created",
    example: "2024-01-01T00:00:00.000Z",
  })
  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  created_at: Date;

  @ApiProperty({
    description: "The date and time when the member was last updated",
    example: "2024-01-01T00:00:00.000Z",
  })
  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
    onUpdate: "CURRENT_TIMESTAMP(6)",
  })
  updated_at: Date;
}
