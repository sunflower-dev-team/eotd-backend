import { OmitType, PartialType } from '@nestjs/swagger';
import { User } from 'src/schemas/user.schema';

export class UserInfo extends PartialType(
  OmitType(User, ['password'] as const),
) {}
