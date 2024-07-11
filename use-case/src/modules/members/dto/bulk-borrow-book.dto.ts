import { ApiProperty } from "@nestjs/swagger";
import { Member } from "@database/entities/member.entity";
import { Type } from "class-transformer";
import { ArrayMaxSize, ArrayMinSize, IsArray, IsInt, IsNumber } from "class-validator";

export class BulkBorrowBookBodyDto {
  @ApiProperty({
    description:
      "An array of unique identifiers representing the books to be borrowed with max length of array 2",
    example: [1, 2],
    required: true,
  })
  @IsArray({ message: "book_ids must be an array" })
  @ArrayMinSize(1, { message: "At least one book_id is required" })
  @ArrayMaxSize(2, { message: "Maximum two book_ids are allowed" })
  @IsInt({ each: true, message: "Each book_id must be an integer" })
  book_ids: number[];
}

export class BulkBorrowBookParamDto {
  @ApiProperty({
    description: "The id of member",
    example: 1,
  })
  @Type(() => Number)
  @IsNumber()
  id: number;
}

export class BulkBorrowBookOkResponseDto extends Member {}
