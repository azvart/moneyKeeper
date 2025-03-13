import {
  Controller,
  Patch,
  HttpException,
  HttpStatus,
  Req,
  Body,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Request } from 'express';
import { UpdateUserDto } from './dto/user.dto';

interface RequestWithUser extends Request {
  user: {
    id: string;
  };
}

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch('update')
  public async updateExistUser(
    @Req() request: RequestWithUser,
    @Body('user') updatedData: UpdateUserDto,
  ) {
    try {
      return await this.userService.updateUser(request.user.id, updatedData);
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
}
