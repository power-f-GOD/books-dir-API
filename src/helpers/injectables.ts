import { Request, Response, NextFunction } from 'express';

import { BResponseError, BResponseSuccess } from './response';

export namespace Injectables {
  export function Http(
    _target: any,
    _propertyName: string,
    descriptor: TypedPropertyDescriptor<Function | any>
  ) {
    const method = descriptor.value!;

    descriptor.value = async (
      ...args: [Request, Response, NextFunction | undefined]
    ) => {
      const response = args[1];

      try {
        const methodResolution = (await method.apply(descriptor, args)) as
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
        response?.status(e.status || 400).send({
          error: true,
          message: e.message
        });
      }
    };
  }
}
