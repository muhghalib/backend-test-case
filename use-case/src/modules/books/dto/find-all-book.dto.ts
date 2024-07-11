import { IsEnum, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";

import { ApiProperty, OmitType } from "@nestjs/swagger";

import { PaginatedResultDto } from "@common/dto/paginated-result.dto";
import { PaginationDto } from "@common/dto/pagination.dto";
import { Member } from "@database/entities/member.entity";
import { Book } from "@database/entities/book.entity";

import { BookStatusEnum } from "@src/common/enums/book-status.enum";

export class FindAllBookQueryDto extends PaginationDto {
  @ApiProperty({
    description: "Search term for filtering books by name or code",
    required: false,
  })
  @Type(() => String)
  @IsOptional()
  @IsString()
  search?: string = "";

  @ApiProperty({
    description: "Search term for filtering books by name or code",
    required: false,
    enum: BookStatusEnum,
  })
  @Type(() => String)
  @IsOptional()
  @IsEnum(BookStatusEnum)
  status?: BookStatusEnum;
}

export class FindAllBookOkResponseDto extends OmitType(PaginatedResultDto<Member>, ["data"]) {
  @ApiProperty({
    description: "The list of filtered books",
    type: () => [OmitType(Book, ["borrowed_by"])],
  })
  data: Omit<Book, "borrowed_by">[];
}
