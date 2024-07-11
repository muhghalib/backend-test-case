import { Module } from "@nestjs/common";

import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { join } from "path";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: "mysql",
        host: configService.get("database.host"),
        port: configService.get("database.port"),
        username: configService.get("database.user"),
        password: configService.get("database.pass"),
        database: configService.get("database.name"),
        entities: [join(__dirname, "..", "**/*.entity{.ts,.js}")],
        migrationsRun: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
