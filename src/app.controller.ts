import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('')
export class AppController {
  @Get()
  home() {
    return 'Welcome EOTD API';
  }

  @Get('/success/signup')
  successSignup() {
    return 'success';
  }

  @Get('/success/password/:password')
  successPassword(@Param('password') password: string) {
    return password;
  }

  @Get('/failed')
  failed() {
    return 'failed';
  }

  @Get('/cookie')
  @UseGuards(AuthGuard('jwt-access'))
  getCookieData(@Req() req: Request) {
    return req.user;
  }
}
