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

    (response as any).err = exception;

    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();

      response.status(statusCode).json({
        statusCode,
        message: exception.message,
      });
    } else {
      const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

      response.status(statusCode).json({
        statusCode,
        message: 'Internal server error',
      });
    }
  }
}
