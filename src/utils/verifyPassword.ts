import { VerifyPasswordDto } from './dto/verifyPassword.dto';
import { hashPassword } from './hashPassword';

export const verifyPassword = async (
  verifyData: VerifyPasswordDto,
): Promise<boolean> => {
  const hash = await hashPassword({
    password: verifyData.password,
    salt: verifyData.salt,
  });

  return hash === verifyData.heshedPassword;
};
