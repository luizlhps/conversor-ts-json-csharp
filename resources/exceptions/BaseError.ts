export interface CustomErrorOptions {
  message: string;
  status: number;
}
export class BaseError extends Error {
  status: number;
  message_error: string;

  constructor(message: string, statusCode: number) {
    super(message);
    this.message_error = message;
    this.status = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
