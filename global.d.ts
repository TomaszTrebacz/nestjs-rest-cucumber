import { INestApplication } from '@nestjs/common';

declare global {
  namespace NodeJS {
    interface Global {
      hashedUserPassword: string;
      app: INestApplication;
    }
  }
}
