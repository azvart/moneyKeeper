import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class GlobalInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const path = context.switchToHttp().getRequest<Request>().path;
    const token = context.switchToHttp().getRequest<Request>().cookies;
    return next.handle();
  }
}
