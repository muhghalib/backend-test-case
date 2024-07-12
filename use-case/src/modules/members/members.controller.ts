import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  HttpCode,
  ValidationPipe,
  Query,
} from "@nestjs/common";

import { ApiBasicAuth, ApiResponse, ApiTags } from "@nestjs/swagger";

import {
  BulkBorrowBookBodyDto,
  BulkBorrowBookOkResponseDto,
  BulkBorrowBookParamDto,
} from "./dto/bulk-borrow-book.dto";

import {
  BulkReturnBookBodyDto,
  BulkReturnBookOkResponseDto,
  BulkReturnBookParamsDto,
} from "./dto/bulk-return-book";
import { FindOneMemberParamsDto, FindOneMemberOkResponseDto } from "./dto/find-one-member.dto";
import { FindAllMemberQueryDto, FindAllMemberOkResponseDto } from "./dto/find-all-member.dto";
import { CreateMemberBodyDto, CreateMemberBodyDtoCreatedResponse } from "./dto/create-member.dto";

import { MembersService } from "./members.service";

@ApiBasicAuth()
@ApiTags("Members")
@Controller("members")
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @ApiResponse({ status: 201, type: CreateMemberBodyDtoCreatedResponse })
  @ApiResponse({ status: 400, description: "Validation failed, the data provided is invalid" })
  @Post("/")
  @HttpCode(201)
  create(@Body(new ValidationPipe()) createMemberBodyDto: CreateMemberBodyDto) {
    return this.membersService.create(createMemberBodyDto);
  }

  @ApiResponse({ status: 200, type: FindAllMemberOkResponseDto })
  @Get("/")
  @HttpCode(200)
  findAll(@Query() findAllMemberQueryDto: FindAllMemberQueryDto) {
    return this.membersService.findAll(findAllMemberQueryDto);
  }

  @ApiResponse({ status: 200, type: FindOneMemberOkResponseDto })
  @ApiResponse({ status: 404, description: "The member is not found" })
  @Get("/:id")
  @HttpCode(201)
  findOne(@Param() findOneMemberParamDto: FindOneMemberParamsDto) {
    return this.membersService.findOne(findOneMemberParamDto);
  }

  @ApiResponse({ status: 200, type: BulkBorrowBookOkResponseDto })
  @ApiResponse({ status: 400, description: "Validation failed, the data provided is invalid" })
  @ApiResponse({ status: 404, description: "The member is not found" })
  @ApiResponse({ status: 403, description: "The member are being penalized" })
  @ApiResponse({
    status: 406,
    description:
      "The member is trying to borrow more than 2 books or has already borrowed more than 2",
  })
  @ApiResponse({
    status: 409,
    description: "One or more books are not available to borrow",
  })
  @Patch("/:id/bulk-borrow-book")
  @HttpCode(200)
  bulkBorrowBook(
    @Param() bulkBorrowBookParamDto: BulkBorrowBookParamDto,
    @Body(new ValidationPipe()) bulkBorrowBookBodyDto: BulkBorrowBookBodyDto,
  ) {
    return this.membersService.bulkBorrowBook(bulkBorrowBookParamDto, bulkBorrowBookBodyDto);
  }

  @ApiResponse({ status: 200, type: BulkReturnBookOkResponseDto })
  @ApiResponse({ status: 400, description: "Validation failed, the data provided is invalid" })
  @ApiResponse({ status: 404, description: "The member is not found" })
  @ApiResponse({
    status: 409,
    description: "The member has not borrowed one or more of the books",
  })
  @Patch("/:id/bulk-return-book")
  @HttpCode(200)
  bulkReturnBook(
    @Param() bulkReturnBookParamDto: BulkReturnBookParamsDto,
    @Body(new ValidationPipe()) bulkReturnBookBodyDto: BulkReturnBookBodyDto,
  ) {
    return this.membersService.bulkReturnBooks(bulkReturnBookParamDto, bulkReturnBookBodyDto);
  }
}
