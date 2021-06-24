import express, {
  Request,
  Response,
  NextFunction,
  response,
  Application
} from 'express';
import BooksService from 'src/services/books.service';
import debug, { IDebugger } from 'debug';
import { Book } from 'src/types';

const log: IDebugger = debug('books-dir:books-middleware');

class BooksMiddleware {
  async validateRequiredRequestBodyFields(
    request: Request<any, any, Book>,
    response: Response,
    next: NextFunction
  ) {
    const requireds = ['title', 'author', 'page_count'];

    for (const required of requireds) {
      if (
        !(required in request.body) ||
        (/^(PUT|PATCH|DELETE)/.test(request.method) && !request.body.id)
      ) {
        return response
          .status(400)
          .send({ error: true, message: `missing '${required}' is required!` });
      }
    }

    next();
  }

  async sanitizeRequestBodyFields(
    request: Request<any, any, Book>,
    _response: Response,
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

  async validateSameBookExists(
    request: Request<any, any, Book>,
    response: Response,
    next: NextFunction
  ) {
    this.validateRequiredRequestBodyFields(request, response, next);

    const { title, author } = request.body;
    const book = await BooksService.getByBookTitle(title);

    if (book && book.author === author) {
      return response.status(400).send({
        error: true,
        message: `Sorry, book with title '${title}' and author '${author}' already exists. Kindly add another book.`
      });
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
