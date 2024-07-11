import { Connection } from "typeorm";
import { Factory, Seeder } from "typeorm-seeding";
import { Member } from "../entities/member.entity";

export class MemberSeed implements Seeder {
  async run(factory: Factory, connection: Connection): Promise<void> {
    await factory(Member)().createMany(10);
  }
}
