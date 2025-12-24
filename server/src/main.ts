import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { resolve } from 'path';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

// .env 파일 로드
config({ path: resolve(process.cwd(), '.env') });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger 설정
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Verdict AI API')
    .setDescription('Verdict AI API 문서')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', '인증 관련 API')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3333);
}
void bootstrap();
