export interface KakaoTokenData {
  id: number;
  connected_at: string;
  kakao_account: {
    has_email: boolean;
    email: string;
  };
}
