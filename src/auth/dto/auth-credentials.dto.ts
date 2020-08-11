import { IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { RegularExpression } from '../regular-expression.enum';
import { ApiProperty } from '@nestjs/swagger';

export class AuthCredentialsDto {
  @ApiProperty({
    examples: ['user1, user2, user3'],
    example: 'user1',
  })
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @ApiProperty({
    example: 'Passw0d#',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(RegularExpression.PASSWORD, { message: 'password too weak' })
  password: string;
}

export class AuthCredentialsResponseDto {
  accessToken: string;
}
