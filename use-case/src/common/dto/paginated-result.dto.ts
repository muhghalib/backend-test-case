import { ApiProperty } from "@nestjs/swagger";

export class PaginatedResultDto<T> {
  data: T[];

  @ApiProperty({
    description: "Current page number",
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: "Number of entries per page",
    example: 10,
  })
  entries: number;

  @ApiProperty({
    description: "Total number of items available",
    example: 1,
  })
  data_count: number;
}
