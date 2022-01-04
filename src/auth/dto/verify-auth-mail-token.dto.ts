import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyAuthMailToken {
  @IsNotEmpty()
  @IsString()
  readonly e_mail: string;

  @IsNotEmpty()
  @IsString()
  readonly authMailToken: string;
}
