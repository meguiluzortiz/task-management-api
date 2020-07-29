import { IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { RegularExpression } from '../regular-expression.enum';

export class AuthCredentialsDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(RegularExpression.PASSWORD, { message: 'password too weak' })
  password: string;
}

export class AuthCredentialsResponseDto {
  accessToken: string;
}
