import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';

function setupSwagger<T>(app: INestApplication<T>, prefix: string) {
  const config = new DocumentBuilder()
    .setTitle('I-Can-Guess API')
    .setDescription('I Can Guess')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${prefix}/swagger`, app, document);
}

(BigInt.prototype as any).toJSON = function () {
  const int = Number.parseInt(this.toString());
  return int ?? this.toString();
};

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

  app.use(cookieParser());
  // app.use(
  //   session({
  //     name: 'siwe-quickstart',
  //     secret: 'siwe-quickstart-secret',
  //     resave: true,
  //     saveUninitialized: true,
  //     cookie: { secure: false, sameSite: true },
  //   }),
  // );

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  setupSwagger(app, globalPrefix);

  app.enableCors({
    origin: [
      'https://ab55-2a09-bac5-597a-52d-00-84-a0.ngrok-free.app',
      'https://e3d8-5-181-248-159.ngrok-free.app',
      'https://icanguess.com',
      'https://icanguess-ai.netlify.app/',
      'http://localhost:5173',
    ],

    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: [
      'Content-Type',
      'Accept',
      'Access-Control-Allow-Origin',
      'Authorization',
      'ngrok-skip-browser-warning',
    ],
  });

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
