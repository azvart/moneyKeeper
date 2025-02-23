import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountSchema } from '../schemas/account.schema';
import { UserSchema } from '../schemas/user.schema';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'account', schema: AccountSchema },
      { name: 'user', schema: UserSchema },
    ]),
  ],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}
