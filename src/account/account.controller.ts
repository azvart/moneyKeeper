import {
  Controller,
  Get,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AccountService } from './account.service';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}
  @Get('account')
  public async getAccount() {}

  @Post('create-account')
  public async createAccount(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    try {
      return await this.accountService.createAccount({ email, password });
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Account with this email already exist',
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: error,
        },
      );
    }
  }
}
