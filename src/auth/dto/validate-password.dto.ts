import { IsNotEmpty, IsString } from 'class-validator';

export class ValidatePasswordDto {
  @IsNotEmpty()
  @IsString()
  current_password: string;
}
