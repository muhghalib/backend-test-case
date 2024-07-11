import { ApiProperty } from "@nestjs/swagger";
import { Member } from "@database/entities/member.entity";
import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsInt, IsNumber } from "class-validator";

export class BulkReturnBookBodyDto {
  @ApiProperty({
    description: "An array of unique identifiers representing the books to be return.",
    example: [1],
    required: true,
  })
  @IsArray({ message: "book_ids must be an array" })
  @ArrayMinSize(1, { message: "At least one book_id is required" })
  @IsInt({ each: true, message: "Each book_id must be an integer" })
  book_ids: number[];
}

export class BulkReturnBookParamsDto {
  @ApiProperty({
    description: "The id of member",
    example: 1,
  })
  @Type(() => Number)
  @IsNumber()
  id: number;
}

export class BulkReturnBookOkResponseDto extends Member {}
