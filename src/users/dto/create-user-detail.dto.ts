import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateUserDetailDto {
  @IsNotEmpty()
  @IsString()
  readonly nickname: string;

  @IsNotEmpty()
  @IsNumber()
  readonly height: number;

  @IsNotEmpty()
  @IsNumber()
  readonly weight: number;

  @IsOptional()
  @IsNumber()
  readonly smm: number;

  @IsOptional()
  @IsNumber()
  readonly bfm: number;

  @IsOptional()
  @IsNumber()
  readonly pbf: number;
}
