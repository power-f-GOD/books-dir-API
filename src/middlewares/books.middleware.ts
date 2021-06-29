import { NextFunction } from 'express';

import { BooksDB } from 'src/db';
import { Book, BRequest, BResponse, BRequestBody } from 'src/types';
import { BResponseError, BHttpHandler } from 'src/helpers';
import { HttpStatusCode } from 'src/constants';

class BooksMiddleware {
  static validRequestBodyFields: Omit<
    Required<Book>,
    'created_at' | 'updated_at' | '_id' | 'ratings' | 'ratings_count' | 'rating'
  > = {
    author: '',
    created_by: '',
    creator_secret: '',
    mandate_update_with_secret: false,
    page_count: '',
    rider: '',
    title: '',
    updated_by: '',
    word_count: 0
  };

  static requiredRequestBodyFields: Required<
    Pick<Book, 'author' | 'page_count' | 'title'>
  > = {
    author: '',
    page_count: '',
    title: ''
  };

  @BHttpHandler
  async validateRequiredRequestBodyFields(
    request: BRequest,
    _: BResponse,
    next: NextFunction
  ) {
    const requireds = BooksMiddleware.requiredRequestBodyFields;

    request.body.title = request.body.title?.toString().trim();
    request.body.author = request.body.author
      ?.toString()
      .trim()
      .split(' ')
      .map((name) => (name ? name[0].toUpperCase() + name.slice(1) : ''))
      .join(' ');

    // for (const _required in requireds) {
    //   const required = _required as keyof typeof requireds;

    //   if (!(required in request.body)) {
    //     throw new BResponseError(
    //       HttpStatusCode.BAD_REQUEST,
    //       `Missing property, '${required}', is required!`,
    //       true
    //     );
    //   }
    // }

    next();
  }

  @BHttpHandler
  async validateRatingRequestBodyField(
    request: BRequest,
    _: BResponse,
    next: NextFunction
  ) {
    if (!('rating' in request.body)) {
      throw new BResponseError(
        HttpStatusCode.BAD_REQUEST,
        `Missing property, 'rating', is required!`,
        true
      );
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

    if (book && book.author === String(author)) {
      throw new BResponseError(
        HttpStatusCode.BAD_REQUEST,
        `Sorry, book with title '${title}' and author '${author}' already exists. Kindly add another book.`,
        true
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
        HttpStatusCode.BAD_REQUEST,
        /GET|POST/.test(request.method)
          ? 'Invalid request param(s) or route!'
          : `Sorry, book does not exist!`,
        true
      );
    }

    next();
  }

  @BHttpHandler
  async validateCanEditBookDetails(
    request: BRequest,
    _: BResponse,
    next: NextFunction
  ) {
    const book = (await BooksDB.getByIdWithSecret(request.body._id!))!.toJSON();

    if (
      book!.mandate_update_with_secret &&
      book!.creator_secret !== request.body.creator_secret
    ) {
      throw new BResponseError(
        HttpStatusCode.UNATHORIZED,
        "You don't have the right to edit the details of this book. Meet the original creator for their 'creator_secret'.",
        true
      );
    }

    next();
  }

  sanitizeRequestBodyFields(
    request: BRequest,
    _: BResponse,
    next: NextFunction
  ) {
    for (const field in request.body) {
      if (
        !(field in BooksMiddleware.validRequestBodyFields) &&
        field !== '_id'
      ) {
        // @ts-ignore
        delete request.body[field];
      }
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
