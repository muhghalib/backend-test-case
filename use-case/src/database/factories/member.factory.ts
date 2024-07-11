import { define } from "typeorm-seeding";
import { Member } from "../entities/member.entity";

import { randFirstName, randLastName, randUuid, randSoonDate } from "@ngneat/falso";

define(Member, () => {
  const member = new Member();

  const penalty_exp_date = [randSoonDate({ days: 2 }).toISOString(), null][
    Math.floor(Math.random() * 2)
  ];

  member.code = randUuid();
  member.name = randFirstName() + randLastName();
  member.penalty_exp_date = penalty_exp_date;

  return member;
});
