import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    (response as any).err = exception;

    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();

      response.status(statusCode).json(exception.getResponse());
    } else {
      const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

      response.status(statusCode).json({
        statusCode,
        message: 'Internal server error',
        error: 'INTERNAL_SERVER_ERROR',
      });
    }
  }
}
