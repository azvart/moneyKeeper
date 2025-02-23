import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Account } from '../schemas/account.schema';
import { User } from '../schemas/user.schema';

@Injectable()
export class AccountService {
  constructor(
    @InjectModel('account') private readonly accountModel: Model<Account>,
    @InjectModel('user') private readonly userModel: Model<User>,
  ) {}
  public async createAccount({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<Account> {
    const newUser = new this.userModel();
    const savedUser = await newUser.save();
    const newAccount = await this.accountModel.create({
      email,
      password,
      userId: savedUser._id,
    });

    return await newAccount.save();
  }
}
