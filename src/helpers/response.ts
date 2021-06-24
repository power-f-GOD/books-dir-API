import { StatusCode } from 'src/types';

export class BResponseBase<DataType = any> extends Error {
  status: StatusCode;
  message: string;
  data?: any;
  error: boolean;

  constructor(status?: StatusCode, message?: string, data?: DataType) {
    super();
    this.status = status || 200;
    this.message = message || '';
    this.data = data;
    this.error = this.status > 300;
  }
}

export class BResponseSuccess<DataType = any> extends BResponseBase {
  constructor(data?: DataType, message?: string, status?: StatusCode) {
    super(status || 200, message, data);
  }
}

export class BResponseError extends BResponseBase {
  constructor(status?: StatusCode, message?: string) {
    super(status || 500, message || 'A severe error occurred!');
  }
}
