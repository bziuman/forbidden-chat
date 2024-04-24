import { HttpException, HttpStatus, PipeTransform } from '@nestjs/common';
import { SearchUserDto } from '../dto/searchUser.dto';

export class ValidateSearchUserPip implements PipeTransform {
  transform(searchData: SearchUserDto): SearchUserDto {
    const { username } = searchData;

    if (!username)
      throw new HttpException(
        'User name can not be empty',
        HttpStatus.BAD_REQUEST,
      );

    if (username.length < 2) {
      throw new HttpException(
        'User name cant be less 2 characters',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (username.length > 20) {
      throw new HttpException(
        'User name cant be more than 20 characters',
        HttpStatus.BAD_REQUEST,
      );
    }

    return searchData;
  }
}
