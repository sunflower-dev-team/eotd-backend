import { IsNumber, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly gender: string;

  @IsNumber()
  readonly birth: number;

  @IsString()
  readonly e_mail: string;

  @IsString()
  readonly password: string;
}
