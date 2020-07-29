import { Repository, EntityRepository } from 'typeorm';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { ErrorCode } from './error-code.enum';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    const user = this.create();
    user.username = username;
    user.password = await this.hashPassword(password, await bcryptjs.genSalt());
    try {
      await user.save();
    } catch (error) {
      if (error.code === ErrorCode.DUPLICATE_USERNAME) {
        //duplicate username
        throw new ConflictException('Username already exists');
      }
      throw new InternalServerErrorException(error);
    }
  }

  async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    const { username, password } = authCredentialsDto;
    const user = await this.findOne({ username });

    if (user && (await user.validatePassword(password))) {
      return user.username;
    }

    return null;
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcryptjs.hash(password, salt);
  }
}
