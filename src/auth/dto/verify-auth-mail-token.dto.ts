import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyAuthMailTokenDto {
  @IsNotEmpty()
  @IsString()
  readonly e_mail: string;

  @IsNotEmpty()
  @IsString()
  readonly authMailToken: string;
}
