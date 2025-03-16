import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AccountService } from '../account/account.service';

interface RequestWithAccountAndUser extends Request {
  account: any;
  user: any;
}

@Injectable()
export class CookieParserMiddleware implements NestMiddleware {
  constructor(private readonly accountService: AccountService) {}
  async use(req: RequestWithAccountAndUser, res: Response, next: NextFunction) {
    const accountToken = req.cookies.access as string;
    if (!accountToken) {
      next('Invalid access token');
      return;
    }
    const account = await this.accountService.getAccountFromToken(accountToken);
    if (!account) {
      next('Invalid Account');
      return;
    }
    req.account = account;
    req.user = account?.userId;
    next();
  }
}
