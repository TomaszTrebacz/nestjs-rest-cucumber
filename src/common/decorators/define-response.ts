import {
  applyDecorators,
  HttpCode,
  HttpStatus,
  Type as ClassType,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export const DefineResponse = (status: HttpStatus, type?: ClassType) => {
  return applyDecorators(
    HttpCode(status),
    ApiResponse({
      status,
      type,
    }),
  );
};
