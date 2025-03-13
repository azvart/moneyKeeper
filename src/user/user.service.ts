import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('user') private readonly userModel: Model<UserDocument>,
  ) {}

  public async updateUser(
    userId: string,
    user: UpdateUserDto,
  ): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(userId, user, { new: true });
  }
}
