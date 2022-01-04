import { IsString, IsNotEmpty } from 'class-validator';
export class SigninUserDto {
  @IsNotEmpty()
  @IsString()
  readonly e_mail: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
