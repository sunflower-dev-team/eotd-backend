import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SignupUserDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly gender: string;

  @IsNotEmpty()
  @IsNumber()
  readonly birth: number;

  @IsNotEmpty()
  @IsString()
  readonly e_mail: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
