import { Controller, Get, Post, Body } from '@nestjs/common';
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
    return await this.accountService.createAccount({ email, password });
  }
}
