import express, { NextFunction } from 'express';
import cors from 'cors';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import 'dotenv/config';

import { BooksRoutes } from './routes';
import { RoutesConfig } from './common';

export const routes: RoutesConfig[] = [];

const app = express();

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// app.use('/books', (_, __, next: NextFunction) => {
//   // express.Router().get('/', (_, __, next: NextFunction) => {

//   // });

//   next();
// });
routes.push(new BooksRoutes(app));

app.get('/', (_, response) => {
  response.send('Index Route hit!');
});

app.use((_request, response) => {
  response
    .status(404)
    .send({ message: 'The route you requested was not found!' });
});

export default app;
