import { Connection } from "typeorm";
import { Factory, Seeder } from "typeorm-seeding";
import { Book } from "../entities/book.entity";

export class BookSeed implements Seeder {
  async run(factory: Factory, connection: Connection): Promise<void> {
    await factory(Book)().createMany(10);
  }
}
