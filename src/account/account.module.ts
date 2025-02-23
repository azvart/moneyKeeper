import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountSchema } from '../schemas/account.schema';
import { UserSchema } from '../schemas/user.schema';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { genSalt, hash } from 'bcrypt';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: 'account',
        useFactory: () => {
          const schema = AccountSchema;
          schema.pre('save', async function () {
            const salt = await genSalt(10);
            this.password = await hash(this.password, salt);
          });
          return schema;
        },
      },
      {
        name: 'user',
        useFactory: () => {
          return UserSchema;
        },
      },
    ]),
  ],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}
