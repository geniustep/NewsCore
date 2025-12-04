import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { Request, Response, NextFunction } from 'express';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // CORS - Allow all origins (including Vercel deployments)
  app.enableCors({
    origin: true, // Allow all origins
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });


  // Security
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      crossOriginEmbedderPolicy: false,
    }),
  );

  // API Prefix - simple prefix without versioning
  app.setGlobalPrefix('api/v1', {
    exclude: ['/', 'health', 'uploads/(.*)'],
  });

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidUnknownValues: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger Documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('NewsCore API')
    .setDescription('منصة إدارة المحتوى الإخباري - NewsCore CMS API')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('المصادقة', 'تسجيل الدخول والخروج')
    .addTag('المستخدمين', 'إدارة المستخدمين')
    .addTag('المقالات', 'إدارة المقالات الإخبارية')
    .addTag('التصنيفات', 'إدارة التصنيفات')
    .addTag('الوسوم', 'إدارة الوسوم')
    .addTag('الوسائط', 'إدارة الملفات والصور')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
    },
    customSiteTitle: 'NewsCore API Documentation',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info { margin: 20px 0 }
    `,
  });

  const port = configService.get<number>('port', 3000);
  await app.listen(port);

  console.log(`🚀 NewsCore API is running on: http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
}

bootstrap();
