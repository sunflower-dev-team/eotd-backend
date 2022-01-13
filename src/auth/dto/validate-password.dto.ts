import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

export class ValidatePasswordDto extends PickType(CreateUserDto, [
  'password',
] as const) {}
