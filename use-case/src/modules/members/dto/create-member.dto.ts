import { ApiProperty, OmitType } from "@nestjs/swagger";
import { Member } from "@database/entities/member.entity";

import { MinLength, IsString } from "class-validator";

export class CreateMemberBodyDto {
  @ApiProperty({
    description: "The unique code of the member",
    example: "M101",
  })
  @MinLength(1, { message: "code field is required" })
  @IsString({ message: "code field should be a string" })
  code: string;

  @ApiProperty({
    description: "The name of the member",
    example: "NestJS Basics",
  })
  @MinLength(1, { message: "title field is required" })
  @IsString({ message: "title field should be a string" })
  name: string;
}

export class CreateMemberBodyDtoCreatedResponse extends OmitType(Member, ["borrowed_books"]) {}
