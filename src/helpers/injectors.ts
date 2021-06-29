import { Request, Response, NextFunction } from 'express';
import debug from 'debug';

import { BResponseError, BResponseSuccess } from './response';

const log = debug('books-dir:BhttpHandlerInjector');

export function BHttpHandler(
  target: any,
  _propertyName: string,
  descriptor: TypedPropertyDescriptor<Function | any>
) {
  const method = descriptor.value!;

  descriptor.value = async (
    ...args: [Request, Response, NextFunction | undefined]
  ) => {
    const response = args[1];

    try {
      const methodResolution = (await method.apply(target, args)) as
        | BResponseError
        | Partial<BResponseSuccess>
        | undefined;

      if (methodResolution?.error) {
        throw methodResolution;
      } else if (methodResolution) {
        const { status, message, data } = methodResolution;

        if (data || message) {
          response?.status(status || 200).send({
            error: false,
            ...(message ? { message } : {}),
            ...(data ? { data } : {})
          });
        }
      }
    } catch (e) {
      let messages = '';

      for (const path in e.errors || {}) {
        messages += `${e.errors[path].message} `.replace(/\.|!/g, '...');
      }

      log(e);
      response?.status(e.status || 400).send({
        error: true,
        message:
          messages
            .trim()
            .replace(/\.\.\.$/, '.')
            .replace(/`/g, "'")
            .replace('...$', '') || e.message
      });
    }
  };
}
