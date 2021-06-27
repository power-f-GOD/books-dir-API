import { Request } from 'express';
import debug, { IDebugger } from 'debug';

import { BooksDB } from 'src/db';
import { Book } from 'src/types';
import { BResponseSuccess, BHttpHandler } from 'src/helpers';
import { HttpStatusCode } from 'src/constants';

const log: IDebugger = debug('books-dir:books-controller');

class BooksController {
  @BHttpHandler
  async getAll(_request: Request<any, any, Book>) {
    return new BResponseSuccess((await BooksDB.getAll()) || []);
  }

  @BHttpHandler
  async getById(request: Request<any, any, Partial<Book>>) {
    return new BResponseSuccess(await BooksDB.getById(request.body._id!));
  }

  @BHttpHandler
  async getByTitle(request: Request<any, any, Partial<Book>>) {
    return new BResponseSuccess(await BooksDB.getByTitle(request.body.title!));
  }

  @BHttpHandler
  async getByAuthor(request: Request<any, any, Partial<Book>>) {
    return new BResponseSuccess(
      await BooksDB.getByAuthor(request.body.author!)
    );
  }

  @BHttpHandler
  async create(request: Request<any, any, Book>) {
    const created_at = Date.now();

    request.body = {
      ...request.body,

      created_at,
      updated_at: created_at
    };
    log(await BooksDB.create(request.body));
    return new BResponseSuccess(null, 'Book created!', HttpStatusCode.CREATED);
  }

  @BHttpHandler
  async update(request: Request<any, any, Partial<Book>>) {
    const { _id: id, ...rest } = request.body;

    request.body = {
      ...rest,
      updated_at: Date.now()
    };
    log(await BooksDB.updateOne(id!, request.body));
    return new BResponseSuccess(null, 'Book updated!', HttpStatusCode.CREATED);
  }

  @BHttpHandler
  async delete(request: Request<any, any, Book>) {
    log(await BooksDB.deleteOne(request.body._id!));
    return new BResponseSuccess(null, 'Book deleted!');
  }
}

export default new BooksController();
