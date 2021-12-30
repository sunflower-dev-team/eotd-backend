import { IsOptional, IsString } from 'class-validator';

export class SignupUserDto {
  @IsString()
  readonly m: string;

  @IsOptional()
  @IsString()
  readonly e_mail: string;

  @IsOptional()
  @IsString()
  readonly code: string;

  @IsOptional()
  @IsString()
  readonly token: string;

  @IsOptional()
  @IsString()
  readonly secret: string;
}
