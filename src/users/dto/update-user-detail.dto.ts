import { CreateUserDetailDto } from './create-user-detail.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateUserDetailDto extends PartialType(CreateUserDetailDto) {}
