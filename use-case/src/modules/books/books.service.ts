import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateBookBodyDto } from "./dto/create-book.dto";

import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { paginate } from "@common/utils/paginate.util";

import { Book } from "@database/entities/book.entity";

import { FindAllBookQueryDto } from "./dto/find-all-book.dto";
import { FindOneBookParamsDto } from "./dto/find-one-book.dto";

@Injectable()
export class BooksService {
  constructor(@InjectRepository(Book) private bookRepository: Repository<Book>) {}

  create(createBookBodyDto: CreateBookBodyDto) {
    const newBook = new Book();

    newBook.code = createBookBodyDto.code;
    newBook.title = createBookBodyDto.title;
    newBook.author = createBookBodyDto.author;

    return this.bookRepository.save(newBook);
  }

  findAll(findAllBookQueryDto: FindAllBookQueryDto) {
    const { page, limit, search, status } = findAllBookQueryDto;

    const queryBuilder = this.bookRepository.createQueryBuilder("book");

    if (search) {
      queryBuilder.andWhere("book.title LIKE :search OR book.code LIKE :search", {
        search: `%${search}%`,
      });
    }

    if (status == "available" || status == "unavailable") {
      queryBuilder.andWhere(
        status == "available" ? "book.borrowed_by_id IS NULL" : "book.borrowed_by_id IS NOT NULL",
      );
    }

    return paginate(queryBuilder, { page, limit });
  }

  async findOne(findOneBookParamDto: FindOneBookParamsDto) {
    const book = await this.bookRepository.findOne({
      where: { id: findOneBookParamDto.id },
      relations: { borrowed_by: true },
    });

    if (!book) throw new NotFoundException("The book is not found");

    return book;
  }
}
