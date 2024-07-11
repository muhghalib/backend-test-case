import { ApiProperty, OmitType } from "@nestjs/swagger";
import { Member } from "@database/entities/member.entity";
import { Type } from "class-transformer";
import { IsNumber } from "class-validator";

export class FindOneMemberParamsDto {
  @ApiProperty({
    description: "The id of member",
    example: 1,
  })
  @Type(() => Number)
  @IsNumber()
  id: number;
}

export class FindOneMemberOkResponseDto extends Member {
  @ApiProperty({
    description: "Num of total borrowed books",
    example: 1,
  })
  borrowed_books_count: number;
}
