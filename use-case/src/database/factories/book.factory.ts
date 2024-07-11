import { define } from "typeorm-seeding";
import { Book } from "../entities/book.entity";

import { randBook, randUuid } from "@ngneat/falso";

define(Book, () => {
  const book = new Book();

  book.code = randUuid();
  book.title = randBook().title;
  book.author = randBook().author;

  return book;
});
