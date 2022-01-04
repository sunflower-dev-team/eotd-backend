import { Controller, Get } from '@nestjs/common';

@Controller('')
export class AppController {
  @Get()
  home() {
    return 'Welcome EOTD API';
  }

  @Get('/success')
  success() {
    return 'success';
  }

  @Get('/failed')
  failed() {
    return 'failed';
  }
}
