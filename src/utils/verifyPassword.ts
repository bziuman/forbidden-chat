import { VerifyPasswordDto } from './dto/verifyPassword.dto';
import { hashPassword } from './hashPassword';

export const verifyPassword = async (
  verifyData: VerifyPasswordDto,
): Promise<boolean> => {
  const { username, password, heshedPassword, salt } = verifyData;
  const hash = await hashPassword({
    username: username,
    password: password,
    salt: salt,
  });

  return hash === heshedPassword;
};
