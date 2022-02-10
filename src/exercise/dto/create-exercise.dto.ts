import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExerciseDto {
  @ApiProperty({
    description: '운동 이름',
    example: '벤치프레스',
  })
  @IsNotEmpty()
  @IsString()
  readonly exercise_name: string;

  @ApiProperty({
    description: '운동 부위',
    example: '가슴',
  })
  @IsNotEmpty()
  @IsString()
  readonly target: string;

  @ApiProperty({
    description: '설명',
    example: '벤치프레스는 가슴을 모아 가슴 근육 발달에...',
  })
  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @ApiProperty({
    description: '링크',
    example: [
      'https://stackoverflow.com/questions/62050741/request-body-not-showing-in-nest-js-swagger',
      'https://stackoverflow.com/questions/62050741/request-body-not-showing-in-nest-js-swagger',
    ],
    required: false,
  })
  @IsOptional()
  @IsString({ each: true })
  readonly links: string[];

  @ApiProperty({
    description: '응급처치',
    example: [
      'https://stackoverflow.com/questions/62050741/request-body-not-showing-in-nest-js-swagger',
      'https://stackoverflow.com/questions/62050741/request-body-not-showing-in-nest-js-swagger',
    ],
    required: false,
  })
  @IsOptional()
  @IsString({ each: true })
  readonly first_aid: string[];
}
