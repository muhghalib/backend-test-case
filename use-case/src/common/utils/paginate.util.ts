import { Repository, SelectQueryBuilder } from "typeorm";
import { PaginationDto } from "../dto/pagination.dto";
import { PaginatedResultDto } from "../dto/paginated-result.dto";

export async function paginate<T>(
  repository: Repository<T> | SelectQueryBuilder<T>,
  paginationDto: PaginationDto,
): Promise<PaginatedResultDto<T>> {
  const { page = 1, limit = 10 } = paginationDto;

  const offset = (page - 1) * limit;

  const queryBuilder =
    repository instanceof Repository ? repository.createQueryBuilder() : repository;

  const [data, totalCount] = await queryBuilder.skip(offset).take(limit).getManyAndCount();

  return {
    data,
    page,
    entries: limit,
    total_count: totalCount,
  };
}
