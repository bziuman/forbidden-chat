import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { SigninUserDataDto } from '../dto/signinUserData.dto';

@Injectable()
export class ValidateSigninPipe implements PipeTransform {
  transform(signinData: SigninUserDataDto) {
    const { username, password } = signinData;

    if (!username) throw new BadRequestException('User name cant be empty');

    if (!password) throw new BadRequestException('User name cant be empty');

    return signinData;
  }
}
