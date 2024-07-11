import { Module } from "@nestjs/common";

import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "@src/database/database.module";
import { BooksModule } from "@modules/books/books.module";
import { MembersModule } from "@modules/members/members.module";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";

import appConfig from "./configs/app.config";
import databaseConfig from "./configs/database.config";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [appConfig, databaseConfig] }),
    DatabaseModule,
    MembersModule,
    BooksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
