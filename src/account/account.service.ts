import { Model } from 'mongoose';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Account } from '../schemas/account.schema';
import { User } from '../schemas/user.schema';
import { RefreshToken } from '../schemas/refreshtoken.schema';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CreateAccountDto } from './dto/account.dto';
import { compare } from 'bcrypt';

@Injectable()
export class AccountService {
  constructor(
    @InjectModel('account') private readonly accountModel: Model<Account>,
    @InjectModel('user') private readonly userModel: Model<User>,
    @InjectModel('refreshtoken')
    private readonly refreshTokenModel: Model<RefreshToken>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  public async createAccount({ email, password }: CreateAccountDto): Promise<{
    access_token: string;
    refresh_token: string;
  }> {
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
    await newAccount.save();
    const accessToken = await this.generateAccessToken({
      _id: newAccount.userId._id,
    });
    const refreshToken = await this.generateRefreshToken({
      _id: newAccount.userId._id,
    });
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  private async isAccountExist(email: string): Promise<boolean> {
    const isAccountExist = await this.accountModel.find({ email: email });
    return !!isAccountExist.length;
  }

  public async signIn(
    email: string,
    password: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const account = await this.getAccount(email, password);
    const accessToken = await this.generateAccessToken({
      _id: account.userId._id,
    });
    const refreshToken = await this.generateRefreshToken({
      _id: account.userId._id,
    });
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  private async getAccount(email: string, password: string): Promise<Account> {
    const existAccount = await this.accountModel
      .findOne({ email: email })
      .populate('userId', '', this.userModel)
      .exec();
    if (!existAccount) {
      throw new Error('Account with this email does not exist');
    }
    const camparePassword = await compare(password, existAccount.password);

    if (!camparePassword) throw new HttpException('Password is incorrect', 401);
    return existAccount;
  }
  public async logout(token: string) {
    const isDeleted = await this.refreshTokenModel.deleteOne({ token: token });
    return isDeleted.acknowledged;
  }
  private async generateAccessToken(user: {
    _id: Types.ObjectId;
  }): Promise<string> {
    return await this.jwtService.signAsync(
      { id: user._id },
      { expiresIn: '30m', secret: this.configService.get('ACCESS_SECRET') },
    );
  }

  public async refresh(refreshToken: string) {
    if (!refreshToken)
      throw new HttpException('Refresh token is required', 401);

    const storedToken = await this.refreshTokenModel.findOne({
      token: refreshToken,
    });
    if (!storedToken)
      throw new HttpException('Refresh token is empty from db', 403);

    const verifyToken = await this.jwtService.verifyAsync(
      refreshToken,
      this.configService.get('REFRESH_SECRET'),
    );
    if (!verifyToken) throw new HttpException('Refresh token is invalid', 403);
    return await this.generateAccessToken(verifyToken);
  }

  private async generateRefreshToken(user: {
    _id: Types.ObjectId;
  }): Promise<string> {
    const refreshToken = await this.jwtService.signAsync(
      { id: user._id },
      { expiresIn: '7d', secret: this.configService.get('REFRESH_SECRET') },
    );
    const refreshModel = await this.refreshTokenModel.create({
      userId: user._id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    await refreshModel.save();
    return refreshToken;
  }
}
