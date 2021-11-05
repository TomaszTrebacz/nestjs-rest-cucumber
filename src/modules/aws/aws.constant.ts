import { NotFoundException } from '@nestjs/common';

export const AWS_ERROR = {
  FILE_NOT_FOUND: new NotFoundException(
    'File with provided upload token was not found',
    'AWS_FILE_NOT_FOUND',
  ),
  FILE_EXCEEDED_MAX_SIZE: new NotFoundException(
    'File with provided upload token has exceeded max allowed size',
    'AWS_FILE_EXCEEDED_MAX_SIZE',
  ),
  FILE_INVALID_EXTENSION: new NotFoundException(
    'Extension of file with provided upload token is not allowed',
    'AWS_FILE_INVALID_EXTENSION',
  ),
};
