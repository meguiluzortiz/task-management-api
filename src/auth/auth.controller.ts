import { Body, Controller, HttpCode, Post, ValidationPipe } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthCredentialsDto, AuthCredentialsResponseDto } from './dto/auth-credentials.dto';

@ApiTags('auth')
@ApiBadRequestResponse({ description: 'Bad request.' })
@ApiInternalServerErrorResponse({ description: 'Server error.' })
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiCreatedResponse({
    description: 'Success sign-up.',
    links: {
      description: {
        description: 'Luego de crear el usuario usar los valores `username` y `password` para el signUp.',
        operationId: 'AuthController_signIn',
        parameters: {
          username: '$request.body#/username',
          password: '$request.body#/password',
        },
      },
    },
  })
  @ApiConflictResponse({ description: 'Conflict.' })
  @ApiOperation({ operationId: 'AuthController_signUp' })
  @Post('/signup')
  signUp(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.authService.signUp(authCredentialsDto);
  }

  @ApiOkResponse({ description: 'Success sign-in.' })
  @ApiOperation({ operationId: 'AuthController_signIn' })
  @HttpCode(200)
  @Post('/signin')
  signIn(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<AuthCredentialsResponseDto> {
    return this.authService.signIn(authCredentialsDto);
  }
}
