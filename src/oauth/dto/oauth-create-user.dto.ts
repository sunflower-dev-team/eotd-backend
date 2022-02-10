import { OmitType } from '@nestjs/swagger';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

export class OauthCreateUserDto extends OmitType(CreateUserDto, [
  'e_mail',
  'password',
] as const) {}
