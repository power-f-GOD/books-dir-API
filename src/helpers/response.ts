import { HttpStatusCode } from 'src/constants';

export class BResponseBase<DataType = any> extends Error {
  status: HttpStatusCode;
  message: string;
  data?: any[] | Record<string, any>;
  error: boolean;

  constructor(status?: HttpStatusCode, message?: string, data?: DataType) {
    super();
    this.status = status || 200;
    this.message = message || '';
    this.data = data;
    this.error = this.status > 300;
  }
}

export class BResponseSuccess<DataType = any> extends BResponseBase {
  constructor(data?: DataType, message?: string, status?: HttpStatusCode) {
    super(status || 200, message, data);
  }
}

export class BResponseError extends BResponseBase {
  constructor(status?: HttpStatusCode, message?: string) {
    super(status || 500, message || 'A severe error occurred!');
  }
}
