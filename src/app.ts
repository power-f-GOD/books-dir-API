import express, { NextFunction } from 'express';
import expressWinston from 'express-winston';
import cors from 'cors';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import debug from 'debug';
import 'dotenv/config';
import { BooksRoutes } from './routes';
import { RoutesConfig } from './common';
import winston from 'winston';

const debugLog: debug.IDebugger = debug('app');
const app = express();

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  expressWinston.logger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      winston.format.json(),
      winston.format.prettyPrint(),
      winston.format.colorize({ all: true })
    )
  })
);

app.use('/books', BooksRoutes.router);

app.get('/', (_, response) => {
  response.send({ message: '' });
});

app.use((_request, response) => {
  response
    .status(404)
    .send({ message: 'The route you requested was not found!' });
});

export default app;
