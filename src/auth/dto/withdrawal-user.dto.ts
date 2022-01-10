import { IsNotEmpty, IsString } from 'class-validator';

export class WithdrawalUserDto {
  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
