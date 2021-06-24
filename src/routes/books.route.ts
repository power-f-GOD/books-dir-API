import { RoutesConfig } from 'src/common';
import { BooksController } from 'src/controllers';
import { BooksMiddleware } from 'src/middlewares';
import { appRoutesList } from 'bin/www';

export class BooksRoute extends RoutesConfig {
  constructor() {
    super('BooksRoute');
  }

  configRouter() {
    this.router
      .route('/')
      .get(BooksController.getAll)
      .all(BooksMiddleware.validateRequiredRequestBodyFields)
      .post(BooksMiddleware.validateSameBookExists, BooksController.create);
    this.router.param('bookId', BooksMiddleware.extractBookId);
    this.router
      .route('/:bookId')
      .all(BooksMiddleware.validateBookExists)
      .patch(BooksController.update)
      .delete(BooksController.delete);
    return this.router;
  }
}

const _BooksRoute = new BooksRoute();

appRoutesList.push(_BooksRoute);

export default _BooksRoute;
