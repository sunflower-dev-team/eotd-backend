import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class KakaoSigninFailure {
  @ApiProperty({ description: '카카오에서 받은 고유 ID', example: 2104860893 })
  kakao_id: number;

  @ApiProperty({
    description: '유저가 선택한 동의 항목',
    example: 'vi5787@naver.com',
    required: false,
  })
  @IsOptional()
  e_mail: string;
}
