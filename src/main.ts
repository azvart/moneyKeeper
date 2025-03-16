import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalInterceptor } from './interceptors/global.interceptor';
import { GlobalErrorException } from './filters/globalException';
import * as cookieParser from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'],
  });
  app.use(cookieParser());
  app.useGlobalInterceptors(new GlobalInterceptor());
  app.useGlobalFilters(new GlobalErrorException());
  app.enableCors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
