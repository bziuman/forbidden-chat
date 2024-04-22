import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Friend } from 'src/db/pg/entites/friend.entity';
import { User } from 'src/db/pg/entites/user.entity';
import { Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';
import { FriendRequestDto } from './dto/friendRequest.dto';
import { saveAvatar } from 'src/utils/saveAvatar';
import { UpdateAvatarDto } from './dto/updateAvatar.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRespository: Repository<User>,
    @InjectRepository(Friend) private friendRepository: Repository<Friend>,
  ) {}

  async getUser(id: number): Promise<UserDto> {
    const user = await this.userRespository.findOne({
      where: { id: id },
      relations: ['friends'],
    });

    return {
      id: id,
      username: user.username,
      friends: user.friends,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
    };
  }

  async getFriends(id: number): Promise<object> {
    const userFriendsList = await this.userRespository.findOne({
      where: { id: id },
      relations: ['friends'],
    });

    return { friends: userFriendsList.friends };
  }

  async getFriendRequest(friendRequestData: FriendRequestDto) {
    const { userId, friendId } = friendRequestData;
    const user = await this.userRespository.findOne({ where: { id: userId } });
    const friend = await this.userRespository.findOne({
      where: { id: friendId },
    });

    const friendShip = await this.friendRepository.create({
      user: user,
      friend: friend,
    });

    await this.friendRepository.save(friendShip);

    return {};
  }

  async updateUserAvatar(updateAvatarFile: UpdateAvatarDto) {
    const { id, fileAvatar } = updateAvatarFile;
    const user = await this.userRespository.findOne({ where: { id: id } });

    const avatarSave = await saveAvatar({
      username: user.username,
      fileAvatar: fileAvatar,
    });

    user.avatarUrl = avatarSave.path;

    await this.userRespository.save(user);
    return {};
  }

  async updateUserBio(userId: number, bio: string) {
    const user = await this.userRespository.findOne({ where: { id: userId } });
    user.bio = bio;
    await this.userRespository.save(user);
    return {};
  }
}
