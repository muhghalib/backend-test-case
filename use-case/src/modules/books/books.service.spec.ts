import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { BooksService } from "./books.service";
import { Book } from "@database/entities/book.entity";

import { FindAllBookQueryDto } from "./dto/find-all-book.dto";
import { CreateBookBodyDto } from "./dto/create-book.dto";

import { BookStatusEnum } from "@common/enums/book-status.enum";
import { NotFoundException } from "@nestjs/common";

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const createMockRepository = <T = any>(): MockRepository<T> => ({
  save: jest.fn(),
  createQueryBuilder: jest.fn(),
  findOne: jest.fn(),
});

describe("BooksService", () => {
  let service: BooksService;
  let repository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        { provide: getRepositoryToken(Book), useValue: createMockRepository() },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
    repository = module.get<MockRepository<Book>>(getRepositoryToken(Book));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    describe("given dto to create book", () => {
      it("should save the given book dto", async () => {
        const createBookBodyDto = new CreateBookBodyDto();

        createBookBodyDto.code = "123";
        createBookBodyDto.title = "Test Book";
        createBookBodyDto.author = "Test Author";

        repository.save.mockResolvedValue(createBookBodyDto);

        const result = await service.create(createBookBodyDto);

        expect(result).toEqual(createBookBodyDto);
        expect(repository.save).toHaveBeenCalledWith({
          code: "123",
          title: "Test Book",
          author: "Test Author",
        });
      });
    });
  });

  describe("findAll", () => {
    describe("given query for pagination", () => {
      it("should find all books with pagination and filters", async () => {
        const findAllBookQueryDto: FindAllBookQueryDto = {
          page: 1,
          limit: 10,
          search: "Test",
          status: BookStatusEnum["AVAILABLE"],
        };

        const offset = (findAllBookQueryDto.page - 1) * findAllBookQueryDto.limit;

        const queryBuilder = {
          andWhere: jest.fn().mockReturnThis(),
          skip: jest.fn().mockReturnThis(),
          take: jest.fn().mockReturnThis(),
          getManyAndCount: jest.fn().mockResolvedValue([[{}, {}], 2]),
        };

        repository.createQueryBuilder.mockReturnValue(queryBuilder);

        const result = await service.findAll(findAllBookQueryDto);

        expect(queryBuilder.skip).toHaveBeenCalledWith(offset);
        expect(queryBuilder.take).toHaveBeenCalledWith(findAllBookQueryDto.limit);

        expect(queryBuilder.andWhere).toHaveBeenCalledWith("book.title LIKE :search", {
          search: `%Test%`,
        });
        expect(queryBuilder.andWhere).toHaveBeenCalledWith("book.borrowed_by_id IS NULL");

        expect(result.entries).toEqual(findAllBookQueryDto.limit);
        expect(result.page).toEqual(findAllBookQueryDto.page);
        expect(result.data.length).toBeLessThan(findAllBookQueryDto.limit);
      });
    });
  });

  describe("findOne", () => {
    describe("given an exist book id", () => {
      it("should find a book by id", async () => {
        const findOneBookParamDto = { id: 1 };

        const book = { id: 1, code: "123", title: "Test Book", author: "Test Author" };

        repository.findOne.mockResolvedValue(book);

        const result = await service.findOne(findOneBookParamDto);

        expect(repository.findOne).toHaveBeenCalledWith({
          where: { id: findOneBookParamDto.id },
          relations: { borrowed_by: true },
        });
        expect(result).toEqual(book);
      });
    });

    describe("given a non-existent book id", () => {
      it("should throw an error 404", async () => {
        const findOneBookParamDto = { id: 1 };

        const book = { id: 2, code: "123", title: "Test Book", author: "Test Author" };

        repository.findOne.mockResolvedValue(book);

        expect(repository.findOne).toHaveBeenCalledWith({
          where: { id: findOneBookParamDto.id },
          relations: { borrowed_by: true },
        });

        expect(service.findOne(findOneBookParamDto)).rejects.toThrow(NotFoundException);
      });
    });
  });
});
