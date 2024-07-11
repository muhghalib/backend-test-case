import { Module } from "@nestjs/common";
import { MembersService } from "./members.service";
import { MembersController } from "./members.controller";

import { TypeOrmModule } from "@nestjs/typeorm";
import { Member } from "@database/entities/member.entity";
import { BorrowedBook } from "@database/entities/borrowed-book.entity";
import { Book } from "@database/entities/book.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Member, BorrowedBook, Book])],
  controllers: [MembersController],
  providers: [MembersService],
})
export class MembersModule {}
