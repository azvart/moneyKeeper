import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountModule } from './account/account.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI as string),
    AccountModule,
  ],
})
export class AppModule {}
