import { OmitType } from '@nestjs/swagger';
import { User } from 'src/schemas/user.schema';

export class UserInfo extends OmitType(User, ['password'] as const) {}
