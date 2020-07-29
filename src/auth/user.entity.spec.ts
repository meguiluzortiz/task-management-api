import { User } from './user.entity';
import * as bcryptjs from 'bcryptjs';

const bcrypt = bcryptjs as any;

describe('User entity', () => {
  let user: User;

  describe('validatePassword', () => {
    const passwordValue = '123456';

    beforeEach(() => {
      jest.clearAllMocks();
      user = new User();
      user.password = 'testPassword';
    });

    it('returns true as password is valid', async () => {
      const compareValue = true;
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(compareValue);
      expect(bcrypt.compare).not.toHaveBeenCalled();
      const result = await user.validatePassword(passwordValue);
      expect(bcrypt.compare).toHaveBeenCalledWith(passwordValue, user.password);
      expect(result).toEqual(compareValue);
    });

    it('returns false as password is invalid', async () => {
      const compareValue = false;
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(compareValue);
      expect(bcrypt.compare).not.toHaveBeenCalled();
      const result = await user.validatePassword(passwordValue);
      expect(bcrypt.compare).toHaveBeenCalledWith(passwordValue, user.password);
      expect(result).toEqual(compareValue);
    });
  });
});
