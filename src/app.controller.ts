import { Controller, Get, Param } from '@nestjs/common';

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
}
