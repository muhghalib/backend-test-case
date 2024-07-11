import { ApiProperty, OmitType } from "@nestjs/swagger";
import { Book } from "@database/entities/book.entity";
import { Type } from "class-transformer";
import { IsNumber } from "class-validator";

export class FindOneBookParamsDto {
  @ApiProperty({
    description: "The id of book",
    example: 1,
  })
  @Type(() => Number)
  @IsNumber()
  id: number;
}

export class FindOneBookOkResponseDto extends OmitType(Book, ["borrowed_by"]) {}
