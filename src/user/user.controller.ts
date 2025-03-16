import {
  Controller,
  Patch,
  Get,
  HttpException,
  HttpStatus,
  Req,
  Body,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Request } from 'express';
import { UserDocument } from '../schemas/user.schema';
import { AccountDocument } from '../schemas/account.schema';

interface RequestWithAccountAndUser extends Request {
  account: AccountDocument;
  user: UserDocument;
}

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch('update')
  public async updateExistUser(
    @Req() request: RequestWithAccountAndUser,
    @Body('firstName') firstName: string,
    @Body('lastName') lastName: string,
  ) {
    try {
      return await this.userService.updateUser(request.user?._id, {
        firstName,
        lastName,
      });
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: error.message as string,
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: error,
        },
      );
    }
  }
  @Get()
  public async getUser(@Req() request: RequestWithAccountAndUser) {
    return {
      account: request.account,
      user: request.user,
    };
  }
}
