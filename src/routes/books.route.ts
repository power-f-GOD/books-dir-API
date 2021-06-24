import express from 'express';

import { RoutesConfig } from 'src/common';
import { BooksController } from 'src/controllers';
import { BooksMiddleware } from 'src/middlewares';

export default class BooksRoute extends RoutesConfig {
  constructor(app: express.Application) {
    super(app, 'BooksRoute');
  }

  configRoutes() {
    this.app
      .route('/books')
      .get(BooksController.getAll)
      .all(BooksMiddleware.validateRequiredRequestBodyFields)
      .post(BooksMiddleware.validateSameBookExists, BooksController.create);
    this.app.param('bookId', BooksMiddleware.extractBookId);
    this.app
      .route('/books/:bookId')
      .patch(BooksController.update)
      .delete(BooksController.delete);

    return this.app;
  }
}
