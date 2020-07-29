import { Test } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { ErrorCode } from './error-code.enum';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import { User } from './user.entity';
import * as bcryptjs from 'bcryptjs';

const bcrypt = bcryptjs as any;

describe('UserRepository', () => {
  const mockCredentialsDto = { username: 'TestUsername', password: 'TestPassword' };
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UserRepository],
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);
  });

  describe('signUp', () => {
    let user: User;
    beforeEach(() => {
      user = new User();
      jest.spyOn(userRepository, 'create').mockReturnValue(user);
    });

    it('successfully signs up the user', async () => {
      jest.spyOn(user, 'save').mockResolvedValue(undefined);
      await expect(userRepository.signUp(mockCredentialsDto)).resolves.not.toThrow();
    });

    it('throws a conflict exception as username already exists', async () => {
      jest.spyOn(user, 'save').mockRejectedValue({ code: ErrorCode.DUPLICATE_USERNAME });
      await expect(userRepository.signUp(mockCredentialsDto)).rejects.toThrow(ConflictException);
    });

    it('throws an exception for an unhandled error', async () => {
      jest.spyOn(user, 'save').mockRejectedValue({ code: '1111' }); // unhandled error code
      await expect(userRepository.signUp(mockCredentialsDto)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('validateUserPassword', () => {
    const usernameValue = 'TestUsername';
    let user: User;
    beforeEach(() => {
      user = new User();
      user.username = usernameValue;
      user.validatePassword = jest.fn();
    });

    it('returns the username as validation is sucessful', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(user, 'validatePassword').mockResolvedValue(true);
      const result = await userRepository.validateUserPassword(mockCredentialsDto);
      expect(result).toEqual(usernameValue);
    });

    it('returns null as user cannot be found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
      const result = await userRepository.validateUserPassword(mockCredentialsDto);
      expect(user.validatePassword).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('returns null as password is invalid', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(user, 'validatePassword').mockResolvedValue(false);
      const result = await userRepository.validateUserPassword(mockCredentialsDto);
      expect(user.validatePassword).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe('hashPassword', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('calls bcryptjs.hash to generate a hash', async () => {
      const hash = jest.spyOn(bcrypt, 'hash').mockResolvedValue('testHash');
      expect(hash).not.toHaveBeenCalled();
      const result = await userRepository['hashPassword']('testPassword', 'testSalt');
      expect(hash).toHaveBeenCalled();
      expect(result).toEqual('testHash');
    });
  });
});
