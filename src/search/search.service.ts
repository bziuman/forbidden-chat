import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/db/pg/entites/user.entity';
import { Repository } from 'typeorm';
import { SearchUserDto } from './dto/searchUser.dto';
import { SearchedUserDto } from './dto/searchedUser.dto';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async getUserByName(
    seachedUserData: SearchUserDto,
  ): Promise<SearchedUserDto> {
    const { username } = seachedUserData;
    const user = await this.userRepository.findOne({
      where: { username: username },
      relations: ['friends'],
    });

    if (!user) {
      throw new HttpException(
        'User with this name not found',
        HttpStatus.NOT_FOUND,
      );
    }
    const searchedUser = {
      id: user.id,
      username: user.username,
      avatar: user.avatarUrl,
      bio: user.bio,
      friends: user.friends,
    };

    return searchedUser;
  }
}
