import { ApiProperty, OmitType } from "@nestjs/swagger";
import { Book } from "@database/entities/book.entity";

import { MinLength, IsString } from "class-validator";

export class CreateBookBodyDto {
  @ApiProperty({
    description: "The unique code of the book",
    example: "M101",
  })
  @MinLength(1, { message: "code field is required" })
  @IsString({ message: "code field should be a string" })
  code: string;

  @ApiProperty({
    description: "The title of the book",
    example: "Nest",
  })
  @MinLength(1, { message: "title field is required" })
  @IsString({ message: "title field should be a string" })
  title: string;

  @ApiProperty({
    description: "The author of the book",
    example: "John",
  })
  @MinLength(1, { message: "author field is required" })
  @IsString({ message: "author field should be a string" })
  author: string;
}

export class CreateBookCreatedResponseDto extends OmitType(Book, [
  "borrowed_by",
  "borrowed_by_id",
]) {}
