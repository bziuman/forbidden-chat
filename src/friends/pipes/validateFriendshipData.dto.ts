import { HttpException, HttpStatus, PipeTransform, Req } from '@nestjs/common';
import { FriendshipDto } from '../dto/friendship.dto';
import { FriendshipStatus } from '../enum/friendshipStatus.enum';

export class ValidateFriendshipDataPipe implements PipeTransform {
  transform(@Req() value: any): FriendshipDto {
    console.log(value);

    const username = '123123';
    const { friendName, status } = value;

    if (!username || !friendName)
      throw new HttpException(
        'User name can not be empty',
        HttpStatus.BAD_REQUEST,
      );

    if (username.length < 2 || friendName.length < 2) {
      throw new HttpException(
        'User name cant be less 2 characters',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (username.length > 20 || friendName.length > 20) {
      throw new HttpException(
        'User name cant be more than 20 characters',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (
      status !== FriendshipStatus.Accept &&
      status !== FriendshipStatus.Delete &&
      status !== FriendshipStatus.Pending &&
      status !== FriendshipStatus.Reject
    ) {
      throw new HttpException(
        'The transferred status is not suitable',
        HttpStatus.BAD_REQUEST,
      );
    }

    return value;
  }
}
