import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { SignupUserDataDto } from '../dto/signupUserData.dto';

@Injectable()
export class ValidateSignupPipe implements PipeTransform {
  transform(value: SignupUserDataDto) {
    const { username, password, rePassword, bio } = value;

    if (!username) throw new BadRequestException('User name can not be empty');

    if (username.length < 2) {
      throw new BadRequestException('User name cant be less 2 characters');
    }

    if (username.length > 20) {
      throw new BadRequestException(
        'User name cant be more than 20 characters',
      );
    }

    if (!password) throw new BadRequestException('Password cant be empty');

    if (password.length < 6) {
      throw new BadRequestException('Password cant be less 6 characters');
    }

    if (password.length > 40) {
      throw new BadRequestException('Password cant be more than 40 characters');
    }

    if (!rePassword) throw new BadRequestException('Re-password cant be empty');

    if (rePassword.length < 6) {
      throw new BadRequestException('Re-password cant be less 6 characters');
    }

    if (rePassword.length > 40) {
      throw new BadRequestException(
        'Re-password cant be more than 40 characters',
      );
    }
    if (bio) {
      if (bio.length > 100) {
        throw new BadRequestException('Bio cant be more than 100 characters');
      }
    }

    return value;
  }
}
