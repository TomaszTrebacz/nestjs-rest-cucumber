import {
  applyDecorators,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  Type as ClassType,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { TransformInterceptor } from '@/common/interceptors/transform.interceptor';

export const DefineResponse = (status: HttpStatus, type?: ClassType) => {
  const decorators = [
    HttpCode(status),
    ApiResponse({
      status,
      type,
    }),
  ];

  if (type !== undefined) {
    decorators.push(UseInterceptors(new TransformInterceptor(type)));
  }

  return applyDecorators(...decorators);
};
