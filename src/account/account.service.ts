import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Account } from '../schemas/account.schema';
import { User } from '../schemas/user.schema';
import { CreateAccountDto } from './dto/account.dto';

@Injectable()
export class AccountService {
  constructor(
    @InjectModel('account') private readonly accountModel: Model<Account>,
    @InjectModel('user') private readonly userModel: Model<User>,
  ) {}
  public async createAccount({
    email,
    password,
  }: CreateAccountDto): Promise<Account> {
    if (await this.isAccountExist(email)) {
      throw new Error('Account with this email already exist');
    }
    const newUser = new this.userModel();
    const savedUser = await newUser.save();
    const newAccount = await this.accountModel.create({
      email,
      password,
      userId: savedUser._id,
    });

    return await newAccount.save();
  }

  private async isAccountExist(email: string): Promise<boolean> {
    const isAccountExist = await this.accountModel.find({ email: email });
    return !!isAccountExist.length;
  }

  public async getAccount(email: string): Promise<Account> {
    const existAccount = await this.accountModel
      .findOne({ email: email })
      .populate('userId', '', this.userModel)
      .exec();
    if (!existAccount) {
      throw new Error('Account with this email does not exist');
    }
    return existAccount;
  }
}
