import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = Number(process.env.PORT ?? 4000);
  await app.listen(port, '0.0.0.0');

  Logger.log(`Backend ready on http://localhost:${port}`, 'Bootstrap');
}

bootstrap();
