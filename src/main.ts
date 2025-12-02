import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import compression from 'compression';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { cors: true });
  const configService = app.get(ConfigService);

  app.use(helmet());
  app.use(compression());
  app.setGlobalPrefix(configService.get<string>('api.prefix', 'api'));
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: configService.get<string>('api.version', 'v1'),
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidUnknownValues: true,
      forbidNonWhitelisted: true,
    }),
  );

  const port = configService.get<number>('port', 3000);
  await app.listen(port);
}

bootstrap();
