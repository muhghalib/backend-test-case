import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  ConflictException,
  NotAcceptableException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, IsNull, Repository } from "typeorm";

import { BulkBorrowBookBodyDto, BulkBorrowBookParamDto } from "./dto/bulk-borrow-book.dto";
import { CreateMemberBodyDto } from "./dto/create-member.dto";
import { BulkReturnBookBodyDto, BulkReturnBookParamsDto } from "./dto/bulk-return-book";

import { BorrowedBook } from "@database/entities/borrowed-book.entity";
import { Member } from "@database/entities/member.entity";

import { FindOneMemberParamsDto } from "./dto/find-one-member.dto";
import { FindAllMemberQueryDto } from "./dto/find-all-member.dto";

import { addDaysFromCurrentDate } from "@common/utils/add-days-from-current-date";
import { paginate } from "@src/common/utils/paginate.util";
import { Book } from "@database/entities/book.entity";

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    @InjectRepository(BorrowedBook)
    private readonly borrowedBookRepository: Repository<BorrowedBook>,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    private dataSource: DataSource,
  ) {}

  async findAll(findAllMemberQueryDto: FindAllMemberQueryDto) {
    const { page, limit, search } = findAllMemberQueryDto;

    const queryBuilder = this.memberRepository.createQueryBuilder("member");

    if (search) {
      queryBuilder.andWhere("member.name LIKE :search OR member.code LIKE :search", {
        search: `%${search}%`,
      });
    }

    queryBuilder.leftJoinAndSelect("member.borrowed_books", "borrowedBook");

    const paginatedMembers = await paginate(queryBuilder, { page, limit });

    return {
      data: this.mapMemberWithBorrowedCounts(paginatedMembers.data),
      page: paginatedMembers.page,
      entries: paginatedMembers.entries,
      data_count: paginatedMembers.data_count,
    };
  }

  async findOne(findOneMemberParamDto: FindOneMemberParamsDto) {
    const { id } = findOneMemberParamDto;

    const member = await this.memberRepository.findOne({
      where: { id },
      relations: { borrowed_books: true },
    });

    if (!member) throw new NotFoundException("Member is not found");

    return {
      ...member,
      borrowed_books_count: member.borrowed_books.length,
    };
  }

  async create(createMemberBodyDto: CreateMemberBodyDto) {
    const newMember = new Member();

    newMember.name = createMemberBodyDto.name;
    newMember.code = createMemberBodyDto.code;

    await this.memberRepository.save(newMember);

    return newMember;
  }

  async bulkBorrowBook(
    bulkBorrowBookParamDto: BulkBorrowBookParamDto,
    bulkBorrowBookBodyDto: BulkBorrowBookBodyDto,
  ) {
    // Extract member id from parameters
    const { id } = bulkBorrowBookParamDto;

    // Create a query runner to handle transactions
    const queryRunner = this.dataSource.createQueryRunner();

    // Connect to the database and start a transaction
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Extract book_ids from request body
      const { book_ids } = bulkBorrowBookBodyDto;

      // Retrieve member with borrowed_books relations
      const member = await this.memberRepository.findOne({
        where: { id },
        relations: {
          borrowed_books: true,
        },
      });

      // Throw error if member is not found
      if (!member) {
        throw new NotFoundException("Member is not found");
      }

      // Check if member is penalized
      if (this.memberIsPenalized(member)) {
        throw new ForbiddenException("Member is penalized and cannot borrow books");
      }

      // Ensure member does not exceed borrowing limit
      if (member.borrowed_books.length >= 2 || member.borrowed_books.length + book_ids.length > 2) {
        throw new NotAcceptableException("Cannot borrow more than 2 books");
      }

      // Find available books by their IDs
      const availableBooks = await this.bookRepository.find({
        where: book_ids.map((bookId) => ({ id: bookId, borrowed_by_id: IsNull() })),
      });

      // Check if all requested books are available
      const bookIsAvailable = availableBooks.length == book_ids.length;

      // Throw error if any book is not available
      if (!bookIsAvailable) {
        throw new ConflictException("One or more books are not available for borrowing");
      }

      // Calculate return date (7 days from current date)
      const returnDate = addDaysFromCurrentDate(7);

      // Loop through each book_id and create BorrowedBook records
      for (const bookId of book_ids) {
        // Initialize a new BorrowedBook instance
        const newBorrowedBook = new BorrowedBook();

        // Assign values to newBorrowedBook instance
        newBorrowedBook.book_id = bookId;
        newBorrowedBook.member_id = member.id;
        newBorrowedBook.return_date = returnDate;

        // Save newBorrowedBook record to borrowedBookRepository
        await this.borrowedBookRepository.save(newBorrowedBook);

        // Update book borrowed_by_id to reference newBorrowedBook
        await this.bookRepository.update(bookId, { borrowed_by_id: newBorrowedBook.id });

        // push the new borrowed books to the current borrowed books
        member.borrowed_books.push(newBorrowedBook);
      }

      // Commit transaction if all operations succeed
      await queryRunner.commitTransaction();

      // Return updated member object
      return member;
    } catch (err) {
      // Rollback transaction if any error occurs
      await queryRunner.rollbackTransaction();

      // Throw the caught error
      throw err;
    } finally {
      // Release the query runner
      await queryRunner.release();
    }
  }

  async bulkReturnBooks(
    bulkReturnBookParamDto: BulkReturnBookParamsDto,
    bulkReturnBookBodyDto: BulkReturnBookBodyDto,
  ) {
    // Extract member id from parameters
    const { id } = bulkReturnBookParamDto;

    // Create a query runner to handle transactions
    const queryRunner = this.dataSource.createQueryRunner();

    // Connect to the database and start a transaction
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Extract book_ids from request body
      const { book_ids } = bulkReturnBookBodyDto;

      // Retrieve member with borrowed_books relations
      const member = await this.memberRepository.findOne({
        where: { id },
        relations: {
          borrowed_books: true,
        },
      });

      // Throw error if member is not found
      if (!member) throw new NotFoundException("Member not found");

      // Find borrowed books by member and book_ids
      const borrowedBooks = await this.borrowedBookRepository.find({
        where: book_ids.map((bookId) => ({ member_id: member.id, book_id: bookId })),
      });

      // Check if all specified books are borrowed and being returned by this member
      const memberIsBorrowReturnedBooks = borrowedBooks.length == book_ids.length;

      // Throw error if any book has not been borrowed by the member
      if (!memberIsBorrowReturnedBooks) {
        throw new ConflictException("This member has not borrowed one or more of these books");
      }

      // Check if member has overdue books
      const hasBooksOverdue = member.borrowed_books.some((borrowedBook) => {
        return new Date(borrowedBook.return_date) < new Date();
      });

      // If member has overdue books, update penalty expiration date
      if (hasBooksOverdue) {
        const penaltyExpDate = addDaysFromCurrentDate(3);

        member.penalty_exp_date = penaltyExpDate.toISOString();

        // save the penalty exp date
        await this.memberRepository.save(member);
      }

      // Delete each borrowed book record
      for (const borrowedBook of borrowedBooks) {
        await this.borrowedBookRepository.delete(borrowedBook.id);

        // Update member's borrowed_books array (if necessary)
        member.borrowed_books = member.borrowed_books.filter(({ id }) => id !== borrowedBook.id);
      }

      // Commit transaction if all operations succeed
      await queryRunner.commitTransaction();

      // Return updated member object
      return member;
    } catch (err) {
      // Rollback transaction if any error occurs
      await queryRunner.rollbackTransaction();

      // Throw the caught error
      throw err;
    } finally {
      // Release the query runner
      await queryRunner.release();
    }
  }

  private memberIsPenalized(member: Member) {
    if (!member.penalty_exp_date) return false;

    const now = new Date();

    return Boolean(
      new Date(member.penalty_exp_date) >= now ||
        member.borrowed_books.every((borrowedBook) => new Date(borrowedBook.return_date) <= now),
    );
  }

  private mapMemberWithBorrowedCounts(members: Member[]) {
    return members.map((member) => ({
      ...member,
      borrowed_books_count: member.borrowed_books.length,
    }));
  }
}
