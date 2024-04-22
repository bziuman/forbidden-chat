import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { MatchPasswordDto } from '../dto/matchPassword.dto';
//import { SignupUserDataDto } from '../dto/signupUserData.dto';

@Injectable()
export class MatchPasswordPipe implements PipeTransform {
  transform(value: MatchPasswordDto) {
    const { password, rePassword } = value;
    if (password !== rePassword) {
      throw new BadRequestException('Password dont match');
    }
    return value;
  }
}
