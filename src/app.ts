import express from 'express';
import expressWinston from 'express-winston';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import winston from 'winston';
import 'dotenv/config';

import { BooksRoutes } from 'src/routes';
import { HttpStatusCode } from 'src/constants';

const app = express();

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

app.use((request, response) => {
  if (!/GET|POST|PUT|PATCH|DELETE|HEAD/.test(request.method)) {
    return response.status(HttpStatusCode.NOT_IMPLEMENTED).send({
      message:
        'The request method is not implemented by the server and cannot be handled.'
    });
  }

  response
    .status(HttpStatusCode.NOT_FOUND)
    .send({ message: 'The resource you requested was not found!' });
});

export default app;
