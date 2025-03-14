import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../schemas/user.schema';
import { UserService } from './user.service';
import { UserController } from './user.controller';
@Module({
  imports: [MongooseModule.forFeature([{ name: 'user', schema: UserSchema }])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
