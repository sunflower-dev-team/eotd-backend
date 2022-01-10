import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsString()
  readonly gender: string;

  @IsOptional()
  @IsNumber()
  readonly birth: number;

  @IsOptional()
  @IsString()
  password: string;
}
