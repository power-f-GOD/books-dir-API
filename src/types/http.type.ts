import { Request, Response } from 'express';
import { Book } from './db.type';

export interface RequestParams {
  bookId?: string;
}

export type BResponseBody<T = any> = Partial<{
  error: boolean;
  message: string;
  data: T;
}>;

export interface BRequestBody extends Partial<Book> {}

export type BRequest = Request<RequestParams, BResponseBody, BRequestBody>;

export type BResponse = Response<BResponseBody>;
