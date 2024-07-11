import { IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";

import { ApiProperty, OmitType } from "@nestjs/swagger";

import { PaginatedResultDto } from "@common/dto/paginated-result.dto";
import { PaginationDto } from "@common/dto/pagination.dto";
import { Member } from "@database/entities/member.entity";

export class FindAllMemberQueryDto extends PaginationDto {
  @ApiProperty({
    description: "Search term for filtering members by name or code",
    example: "NestJS Basics",
    required: false,
  })
  @Type(() => String)
  @IsOptional()
  @IsString()
  search?: string = "";
}

export class FindAllMemberOkResponseDto extends OmitType(PaginatedResultDto<Member>, ["data"]) {
  @ApiProperty({
    description: "The list of filtered members",
    type: () => [Member],
  })
  data: Member[];
}
