import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export = {
  type: "mysql",
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
  database: process.env.DATABASE_NAME,
  entities: ["src/database/entities/*.entity{.ts,.js}"],
  migrationsRun: true,
  synchronize: true,
  seeds: ["src/database/seeds/**/*.seed{.ts,.js}"],
  factories: ["src/database/factories/**/*.factory{.ts,.js}"],
};
