import { Request } from 'express';
import debug from 'debug';

import { BooksDB } from 'src/db';
import { Book, BRequestBody } from 'src/types';
import { BResponseSuccess, BHttpHandler } from 'src/helpers';
import { HttpStatusCode } from 'src/constants';

const log = debug('books-dir:books-controller');

class BooksController {
  @BHttpHandler
  async getAll(_request: Request<any, any, BRequestBody>) {
    return new BResponseSuccess((await BooksDB.getAll()) || []);
  }

  @BHttpHandler
  async getById(request: Request<any, any, BRequestBody>) {
    return new BResponseSuccess(await BooksDB.getById(request.body._id!));
  }

  @BHttpHandler
  async getByTitle(request: Request<any, any, BRequestBody>) {
    return new BResponseSuccess(await BooksDB.getByTitle(request.body.title!));
  }

  @BHttpHandler
  async getByAuthor(request: Request<any, any, BRequestBody>) {
    return new BResponseSuccess(
      await BooksDB.getByAuthor(request.body.author!)
    );
  }

  @BHttpHandler
  async create(request: Request<any, any, Book>) {
    request.body = {
      ...request.body,
      created_at: Date.now()
    };
    log(await BooksDB.create(request.body));
    return new BResponseSuccess(null, 'Book created!', HttpStatusCode.CREATED);
  }

  @BHttpHandler
  async update(request: Request<any, any, BRequestBody>) {
    const { _id, ...rest } = request.body;

    request.body = {
      ...rest,
      updated_at: Date.now()
    };
    log(await BooksDB.updateOne(_id!, request.body));
    return new BResponseSuccess(null, 'Book updated!', HttpStatusCode.CREATED);
  }

  @BHttpHandler
  async rateBook(request: Request<any, any, BRequestBody>) {
    const { _id, rating } = request.body;
    let book = (await BooksDB.getByIdWithRatings(_id!))?.toJSON() as Book;
    const ratings = book!.ratings!.concat([rating!]);

    book = {
      ...book,
      ratings,
      rating: ratings.reduce((a, b) => a + b, 0) / ratings.length,
      ratings_count: ratings.length,
      updated_at: Date.now()
    };
    log(await BooksDB.updateOne(_id!, book));
    return new BResponseSuccess(book, 'Book rated!', HttpStatusCode.CREATED);
  }

  @BHttpHandler
  async delete(request: Request<any, any, BRequestBody>) {
    log(await BooksDB.deleteOne(request.body._id!));
    return new BResponseSuccess(null, 'Book deleted!');
  }
}

export default new BooksController();
