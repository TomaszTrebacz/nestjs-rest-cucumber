import { INestApplication } from '@nestjs/common';

declare global {
  namespace NodeJS {
    interface Global {
      hashedUserPassword: string;
      app: INestApplication;
    }
  }
  namespace Express {
    interface Response {
      err?: Error;
    }
  }
}
