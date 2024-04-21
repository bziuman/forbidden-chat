import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { MatchPasswordDto } from '../dto/matchPassword.dto';

@Injectable()
export class MatchPasswordPipe implements PipeTransform {
  transform(value: MatchPasswordDto): boolean {
    const { password, rePassword } = value;
    if (password !== rePassword) {
      throw new BadRequestException('Password dont match');
    }

    return true;
  }
}
