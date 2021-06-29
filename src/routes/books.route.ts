import { RoutesConfig } from 'src/common';
import { BooksMiddleware } from 'src/middlewares';
import { BooksController } from 'src/controllers';
import { appRoutesList } from 'bin/www';

export class BooksRoute extends RoutesConfig {
  constructor() {
    super('BooksRoute');
  }

  configRouter() {
    this.router
      .route('/')
      .get(BooksController.getAll)
      .all(
        BooksMiddleware.sanitizeRequestBodyFields,
        BooksMiddleware.validateRequiredRequestBodyFields,
        BooksMiddleware.validateSameBookExists
      )
      .post(BooksController.create);

    this.router.param('bookId', BooksMiddleware.extractBookId);
    this.router
      .route('/:bookId')
      .all(
        BooksMiddleware.sanitizeRequestBodyFields,
        BooksMiddleware.validateBookExists,
        BooksMiddleware.validateCanEditBookDetails
      )
      .patch(BooksController.update)
      .delete(BooksController.delete);

    this.router
      .route('/:bookId/rate')
      .patch(
        BooksMiddleware.validateRatingRequestBodyField,
        BooksMiddleware.validateBookExists,
        BooksController.rateBook
      );

    return this.router;
  }
}

const _BooksRoute = new BooksRoute();

appRoutesList.push(_BooksRoute);

export default _BooksRoute;
