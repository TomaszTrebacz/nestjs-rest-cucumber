import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CONFIG } from '@/config';
import { HttpExceptionFilter } from '@/common/filters/http-exception.filter';
import { loggerMiddleware } from '@/common/middlewares/logger.middleware';
import { AppModule } from '@/modules/app.module';

export const createApp = async (): Promise<NestExpressApplication> => {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    abortOnError: false,
    logger: false,
    cors: true,
  });

  app.disable('x-powered-by');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(loggerMiddleware);

  if (CONFIG.APP.SWAGGER_IS_ENABLED) {
    const swaggerOptions = new DocumentBuilder()
      .setTitle('App')
      .setVersion(CONFIG.APP.VERSION ?? 'unknown')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerOptions);
    SwaggerModule.setup('docs', app, document);
  }

  await app.listen(CONFIG.APP.PORT);

  return app;
};

if (require.main === module) {
  (async () => {
    try {
      await createApp();
      console.log(`Server is listening on port: ${CONFIG.APP.PORT}`);
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  })();
}
