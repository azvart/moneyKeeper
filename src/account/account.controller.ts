import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AccountService } from './account.service';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('sign-in')
  public async singIn(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    try {
      const { access_token, refresh_token } = await this.accountService.signIn(
        email,
        password,
      );
      return { access_token, refresh_token };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Account not found',
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: error,
        },
      );
    }
  }

  @Post('sign-up')
  public async createAccount(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res() response: Response,
  ) {
    try {
      const { access_token, refresh_token } =
        await this.accountService.createAccount({ email, password });

      response.json({ access_token, refresh_token });
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

  @Post('logout')
  public async logout(@Req() request: Request): Promise<boolean> {
    try {
      return await this.accountService.logout(request.cookies.refreshToken);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: "You can't logout",
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: error,
        },
      );
    }
  }
  @Post('/refresh')
  public async refresh(@Req() request: Request) {
    try {
      return {
        access_token: await this.accountService.refresh(
          request.cookies.refreshToken,
        ),
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Bad reqeust with this refresh token',
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: error,
        },
      );
    }
  }
}
