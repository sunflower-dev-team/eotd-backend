import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

export class ValidatePasswordDto extends PickType(CreateUserDto, [
  'password',
] as const) {}
