import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  ValidationPipe,
  Query,
} from "@nestjs/common";
import { ApiBasicAuth, ApiResponse, ApiTags } from "@nestjs/swagger";

import { CreateBookCreatedResponseDto, CreateBookBodyDto } from "./dto/create-book.dto";
import { FindAllBookQueryDto, FindAllBookOkResponseDto } from "./dto/find-all-book.dto";
import { FindOneBookParamsDto, FindOneBookOkResponseDto } from "./dto/find-one-book.dto";

import { BooksService } from "./books.service";

@ApiBasicAuth()
@ApiTags("Books")
@Controller("books")
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @ApiResponse({ status: 201, type: CreateBookCreatedResponseDto })
  @ApiResponse({ status: 400, description: "Validation failed, the data provided is invalid" })
  @Post("/")
  @HttpCode(201)
  create(
    @Body(new ValidationPipe()) createBookBodyDto: CreateBookBodyDto,
  ): Promise<CreateBookCreatedResponseDto> {
    return this.booksService.create(createBookBodyDto);
  }

  @ApiResponse({ status: 200, type: FindAllBookOkResponseDto })
  @Get("/")
  @HttpCode(200)
  findAll(
    @Query(new ValidationPipe()) findAllBookQueryDto: FindAllBookQueryDto,
  ): Promise<FindAllBookOkResponseDto> {
    return this.booksService.findAll(findAllBookQueryDto);
  }

  @ApiResponse({ status: 200, type: FindOneBookOkResponseDto })
  @ApiResponse({ status: 404, description: "The book is not found" })
  @Get(":id")
  @HttpCode(200)
  findOne(@Param(new ValidationPipe()) findOneBookParamDto: FindOneBookParamsDto) {
    return this.booksService.findOne(findOneBookParamDto);
  }
}
