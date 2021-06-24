import { Request, Response } from 'express';
import debug, { IDebugger } from 'debug';

import { BooksService } from 'src/services';
import { Book } from 'src/types';
import { Injectables, BResponseSuccess } from 'src/helpers';

const log: IDebugger = debug('books-dir:books-controller');

class BooksController {
  @Injectables.Http
  async getAll(_request: Request<any, any, Book>) {
    return new BResponseSuccess(await BooksService.get());
  }

  @Injectables.Http
  async getById(request: Request<any, any, Partial<Book>>) {
    return new BResponseSuccess(await BooksService.getById(request.body.id!));
  }

  @Injectables.Http
  async getByTitle(request: Request<any, any, Partial<Book>>) {
    return new BResponseSuccess(
      await BooksService.getByTitle(request.body.title!)
    );
  }

  @Injectables.Http
  async getByAuthor(request: Request<any, any, Partial<Book>>) {
    return new BResponseSuccess(
      await BooksService.getByAuthor(request.body.author!)
    );
  }

  @Injectables.Http
  async create(request: Request<any, any, Book>) {
    const created_at = Date.now();

    request.body = {
      ...request.body,
      id: `b${String(Math.random())}`.replace(/\./g, ''),
      created_at,
      updated_at: created_at
    };
    log(await BooksService.create(request.body));
    return new BResponseSuccess(null, 'Book created!', 201);
  }

  @Injectables.Http
  async update(request: Request<any, any, Partial<Book>>) {
    const { id, ...rest } = request.body;

    request.body = {
      ...rest,
      updated_at: Date.now()
    };
    log(await BooksService.patchById(id!, request.body));
    return new BResponseSuccess(null, 'Book updated!', 204);
  }

  @Injectables.Http
  async delete(request: Request<any, any, Book>) {
    log(await BooksService.deleteById(request.body.id!));
    return new BResponseSuccess(null, 'Book deleted!', 204);
  }
}

export default new BooksController();
