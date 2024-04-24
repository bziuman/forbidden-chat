import { pbkdf2 } from 'crypto';
import { HashPasswordDto } from './dto/hashPassword.dto';

export const hashPassword = async (
  hashData: HashPasswordDto,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const { username, password, salt } = hashData;
    const userHashData = { username: username, password: password };
    pbkdf2(userHashData, salt, 100000, 64, 'sha512', (error, derivedKey) => {
      if (error) reject(error);
      resolve(derivedKey.toString('hex'));
    });
  });
};
