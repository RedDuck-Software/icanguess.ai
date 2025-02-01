import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import { Session } from 'express-session';

function setupSwagger<T>(app: INestApplication<T>, prefix: string) {
  const config = new DocumentBuilder()
    .setTitle('I-Can-Guess API')
    .setDescription('I Can Guess')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${prefix}/swagger`, app, document);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.use(
    session({
      name: 'siwe-quickstart',
      secret: 'siwe-quickstart-secret',
      resave: true,
      saveUninitialized: true,
      cookie: { secure: false, sameSite: true },
    }),
  );

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  setupSwagger(app, globalPrefix);

  app.enableCors();

  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
  Logger.log(
    `🚀 Swagger is running on: http://localhost:${port}/${globalPrefix}/swagger`,
  );
}
bootstrap();
