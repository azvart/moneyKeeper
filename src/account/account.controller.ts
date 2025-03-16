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

  private responseTokensCookie(
    response: Response,
    access_token: string,
    refresh_token: string,
  ) {
    response.cookie('access', access_token, {
      httpOnly: true,
      sameSite: 'strict',
      expires: new Date(Date.now() + 1800 * 1000),
    });
    response.cookie('refresh', refresh_token, {
      httpOnly: true,
      sameSite: 'strict',
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    response.end();
  }

  @Post('sign-in')
  public async singIn(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res() response: Response,
  ) {
    try {
      const { access_token, refresh_token } = await this.accountService.signIn(
        email,
        password,
      );
      this.responseTokensCookie(response, access_token, refresh_token);
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

      this.responseTokensCookie(response, access_token, refresh_token);
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
  public async logout(@Req() request: Request, @Res() response: Response) {
    try {
      await this.accountService.logout(request.cookies.refreshToken);
      response.cookie('access', '');
      response.cookie('refresh', '');
      response.end();
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
  @Post('refresh')
  public async refresh(@Req() request: Request, @Res() response: Response) {
    try {
      const refresh = request.cookies.refresh as string;
      const access_token = await this.accountService.refresh(refresh);
      response.cookie('access', access_token, {
        httpOnly: true,
        sameSite: 'strict',
        expires: new Date(Date.now() + 1800 * 1000),
      });
      response.end();
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
