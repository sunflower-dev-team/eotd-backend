import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

export class SigninUserDto extends PickType(CreateUserDto, [
  'e_mail',
  'password',
] as const) {}
