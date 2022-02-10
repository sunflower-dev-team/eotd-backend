import { ApiProperty } from '@nestjs/swagger';

export class KakaoSigninFailure {
  @ApiProperty({ description: '카카오에서 받은 고유 ID', example: 2104860893 })
  kakao_id: number;
}
