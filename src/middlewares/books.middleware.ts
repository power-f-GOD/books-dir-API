import { Request, Response, NextFunction } from 'express';

import debug, { IDebugger } from 'debug';

import { BooksService } from 'src/services';
import { Book } from 'src/types';
import { BResponseError, Injectables } from 'src/helpers';

const log: IDebugger = debug('books-dir:books-middleware');

class BooksMiddleware {
  @Injectables.Http
  async validateRequiredRequestBodyFields(
    request: Request<any, any, Book>,
    _: Response,
    next: NextFunction
  ) {
    const requireds = ['title', 'author', 'page_count'];

    request.body.title = request.body.title?.trim();
    request.body.author = request.body.author?.trim();

    for (const required of requireds) {
      if (
        (/^(POST|PUT)/.test(request.method) &&
          //@ts-ignore
          (!(required in request.body) || !request.body[required])) ||
        (/^(PATCH|DELETE)/.test(request.method) && !request.body.id)
      ) {
        throw new BResponseError(
          400,
          `Missing property, '${required}', is required!`
        );
      }
    }

    next();
  }

  async sanitizeRequestBodyFields(
    request: Request<any, any, Book>,
    _: Response,
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

  @Injectables.Http
  async validateSameBookExists(
    request: Request<any, any, Book>,
    _: Response,
    next: NextFunction
  ) {
    const { title, author } = request.body;
    const book = await BooksService.getByTitle(title);

    if (book && book.author === author) {
      throw new BResponseError(
        400,
        `Sorry, book with title '${title}' and author '${author}' already exists. Kindly add another book.`
      );
    }

    next();
  }

  @Injectables.Http
  async validateBookExists(
    request: Request<any, any, Book>,
    _: Response,
    next: NextFunction
  ) {
    if (!(await BooksService.getById(request.body.id!))) {
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
    request: Request<any, any, Book, any, any>,
    _response: Response,
    next: NextFunction,
    id: string
  ) {
    request.body.id = id;
    next();
  }
}

export default new BooksMiddleware();
