import { NextFunction } from 'express';

import { BooksDB } from 'src/db';
import { Book, BRequest, BResponse } from 'src/types';
import { BResponseError, BHttpHandler } from 'src/helpers';

class BooksMiddleware {
  @BHttpHandler
  async validateRequestBodyFields(
    request: BRequest,
    _: BResponse,
    next: NextFunction
  ) {
    const requireds = ['title', 'author', 'page_count'];

    request.body.title = request.body.title?.trim();
    request.body.author = request.body.author?.trim();

    for (const required of requireds) {
      switch (true) {
        //@ts-ignore
        case (!(required in request.body) || !request.body[required]) &&
          /^(POST|PUT)/.test(request.method):
        case /^(PATCH|DELETE)/.test(request.method) && !request.body._id:
          throw new BResponseError(
            400,
            `Missing property, '${required}', is required!`
          );
      }
    }

    next();
  }

  async sanitizeRequestBodyFields(
    request: BRequest,
    _: BResponse,
    next: NextFunction
  ) {
    const validFields: Omit<Book, 'created_at' | 'updated_at' | 'id'> = {
      title: '',
      author: '',
      page_count: '',
      rating: 0,
      rider: ''
    };

    for (const field in request.body) {
      if (!(field in validFields) && field !== 'id') {
        // @ts-ignore
        delete request.body[field];
      }
    }

    next();
  }

  @BHttpHandler
  async validateSameBookExists(
    request: BRequest,
    _: BResponse,
    next: NextFunction
  ) {
    const { title, author } = request.body;
    const book = await BooksDB.getByTitle(title!);

    if (book && book.author === author) {
      throw new BResponseError(
        400,
        `Sorry, book with title '${title}' and author '${author}' already exists. Kindly add another book.`
      );
    }

    next();
  }

  @BHttpHandler
  async validateBookExists(
    request: BRequest,
    _: BResponse,
    next: NextFunction
  ) {
    if (!(await BooksDB.getById(request.body._id!))) {
      throw new BResponseError(
        400,
        /GET|POST/.test(request.method)
          ? 'Invalid request param(s) or route!'
          : `Sorry, book does not exist!`
      );
    }

    next();
  }

  extractBookId(
    request: BRequest,
    _response: BResponse,
    next: NextFunction,
    id: string
  ) {
    request.body._id = id;
    next();
  }
}

export default new BooksMiddleware();
