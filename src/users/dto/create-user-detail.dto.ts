import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDetailDto {
  @ApiProperty({
    required: true,
    example: '나는헬창',
    description: '닉네임',
  })
  @IsNotEmpty()
  @IsString()
  readonly nickname: string;

  @ApiProperty({
    required: true,
    example: 180,
    description: '키',
  })
  @IsNotEmpty()
  @IsNumber()
  readonly height: number;

  @ApiProperty({
    required: true,
    example: 75,
    description: '몸무게',
  })
  @IsNotEmpty()
  @IsNumber()
  readonly weight: number;

  @ApiProperty({
    required: false,
    example: 40,
    description: '골격근량(SMM: Skeletal Muscle Mass)',
  })
  @IsOptional()
  @IsNumber()
  readonly smm: number;

  @ApiProperty({
    required: false,
    example: 14,
    description: '체지방량(BFM: Body Fat Mass)',
  })
  @IsOptional()
  @IsNumber()
  readonly bfm: number;

  @ApiProperty({
    required: false,
    example: 23,
    description: 'BMI(Body Mass Index)',
  })
  @IsOptional()
  @IsNumber()
  readonly bmi: number;

  @ApiProperty({
    required: false,
    example: 12,
    description: '체지방률(PBF: Percent Body Fat)',
  })
  @IsOptional()
  @IsNumber()
  readonly pbf: number;
}
