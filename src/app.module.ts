import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountModule } from './account/account.module';
import { UserModule } from './user/user.module';
import { CookieParserMiddleware } from './middlewares/global.middleware';

@Module({
  imports: [
    JwtModule.register({ global: true }),
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: await configService.get('MONGO_URI'),
      }),
    }),
    AccountModule,
    UserModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CookieParserMiddleware)
      .exclude(
        {
          path: 'account',
          method: RequestMethod.ALL,
        },
        {
          path: 'account/*path',
          method: RequestMethod.ALL,
        },
      )
      .forRoutes('*');
  }
}
