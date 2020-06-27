import { JwtStrategy } from './jwt.strategy';
import { Test } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { UnauthorizedException } from '@nestjs/common';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JwtStrategy, //
        UserRepository,
      ],
    }).compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  describe('validate', () => {
    const usernameValue = 'TestUsername';

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('validates and returns the user based on JWT payload', async () => {
      const user = new User();
      user.username = 'TestUsername';

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      const result = await jwtStrategy.validate({ username: usernameValue });
      expect(userRepository.findOne).toHaveBeenCalledWith({ username: usernameValue });
      expect(result).toEqual(user);
    });

    it('throws an unauthorized exception as user cannot be found', () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
      expect(jwtStrategy.validate({ username: usernameValue })).rejects.toThrow(UnauthorizedException);
    });
  });
});
