import express, { Request, Response, NextFunction } from 'express';
import debug, { IDebugger } from 'debug';

import BooksService from 'src/services/books.service';
import { Book } from 'src/types/books.type';

const log: IDebugger = debug('books-dir:books-controller');

class BooksController {
  async getAll(_request: Request<any, any, Book>, response: Response) {
    response.status(200).send({ error: false, data: await BooksService.get() });
  }

  async getById(request: Request<any, any, Partial<Book>>, response: Response) {
    response.status(200).send({
      error: false,
      data: await BooksService.getById(request.body.id!)
    });
  }

  async getByTitle(
    request: Request<any, any, Partial<Book>>,
    response: Response
  ) {
    response.status(200).send({
      error: false,
      data: await BooksService.getByBookTitle(request.body.title!)
    });
  }

  async getByAuthor(
    request: Request<any, any, Partial<Book>>,
    response: Response
  ) {
    response.status(200).send({
      error: false,
      data: await BooksService.getByBookAuthor(request.body.author!)
    });
  }

  async create(request: Request<any, any, Book>, response: Response) {
    const created_at = Date.now();

    request.body = {
      ...request.body,
      id: `b${String(Math.random())}`.replace(/\./g, ''),
      created_at,
      updated_at: created_at
    };
    log(await BooksService.create(request.body));
    response.status(201).send({
      error: false,
      message: 'Book created!'
    });
  }

  async update(request: Request<any, any, Partial<Book>>, response: Response) {
    const { id, ...rest } = request.body;

    request.body = {
      ...rest,
      updated_at: Date.now()
    };
    log(await BooksService.patchById(id!, request.body));
    response.status(204).send({
      error: false,
      message: 'Book updated!'
    });
  }

  async delete(request: Request<any, any, Book>, response: Response) {
    log(await BooksService.deleteById(request.body.id!));
    response.status(204).send({ error: false, message: 'Book deleted!' });
  }
}

export default new BooksController();
