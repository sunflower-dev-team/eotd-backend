import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDailyDietDto {
  @ApiProperty({ description: '식단 유형', example: '아침' })
  @IsNotEmpty()
  @IsString()
  readonly diet_type: string;

  @ApiProperty({
    description: '세부사항',
    example: '부대찌개에 밥 4공기 뚝딱... 식단 잘 짜자 길동아',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly detail: string;

  @ApiProperty({ description: '식사 시간', example: '08:20', required: false })
  @IsOptional()
  @IsString()
  readonly time: string;

  @ApiProperty({
    description: '음식 사진',
    example:
      'https://media.vlpt.us/images/peter0618/post/51a9e282-ae0a-46ef-85bd-8ab0a36747fc/Nestjs.png',
    required: false,
  })
  @IsOptional()
  @IsString({ each: true })
  readonly imgs: string[];

  @ApiProperty({ description: '식단 평점', example: 3 })
  @IsNotEmpty()
  @IsNumber()
  readonly rate: number;
}
