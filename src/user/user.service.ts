import { HttpException, HttpStatus, Injectable, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Friend } from 'src/db/pg/entites/friend.entity';
import { User } from 'src/db/pg/entites/user.entity';
import { Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';
import { saveAvatar } from 'src/utils/saveAvatar';
import { UpdateBioDto } from './dto/updateBio.dto';
import { FriendsListDto } from './dto/friendsList.dto';
import { StatusFriendshipListRequestDto } from './dto/statusFriendshipRequest.dto';
import { SuccessUpdateAvatarDto } from './dto/successUpdateAvatar.dto';
import { SuccessUpdateBioDto } from './dto/successUpdateBio.dto';
import { GetUserDataDto } from './dto/getUserData.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRespository: Repository<User>,
    @InjectRepository(Friend) private friendRepository: Repository<Friend>,
  ) {}

  async getUser(@Req() request: any): Promise<UserDto> {
    const userData = request.userTokenData;
    const { username } = userData;
    const user = await this.getUserData({
      type: 'user',
      username: username,
    });

    return {
      id: user.id,
      username: user.username,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
    };
  }

  async getFriends(@Req() request: any): Promise<FriendsListDto> {
    const { username } = request.userTokenData;
    const userFriendsList = await this.getUserData({
      type: 'friends',
      username: username,
    });

    return { friends: userFriendsList };
  }

  async getFriendRequest(
    @Req() request: any,
  ): Promise<StatusFriendshipListRequestDto> {
    const { username } = request.userTokenData;
    const user = await this.getUserData({
      type: 'friends',
      username: username,
    });

    return { status: true, friends: user };
  }

  async updateUserAvatar(
    @Req() request: any,
    file: Express.Multer.File,
  ): Promise<SuccessUpdateAvatarDto> {
    const { username } = request.userTokenData;

    const user = await this.userRespository.findOne({
      where: { username: username },
    });

    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const avatarSave = await saveAvatar({
      username: username,
      avatarFile: file,
    });

    user.avatarUrl = avatarSave.path;

    await this.userRespository.save(user);

    return {
      success: true,
      user: {
        id: user.id,
        username: user.username,
        avatarUrl: avatarSave.path,
        bio: user.bio,
        friends: user.friends,
      },
    };
  }

  async updateUserBio(
    @Req() request: any,
    updateBioData: UpdateBioDto,
  ): Promise<SuccessUpdateBioDto> {
    const { username } = request.userTokenData;
    const { bio } = updateBioData;
    const user = await this.userRespository.findOne({
      where: { username: username },
    });

    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    user.bio = bio;

    await this.userRespository.save(user);
    return {
      success: true,
      user: {
        id: user.id,
        username: user.username,
        avatarUrl: user.avatarUrl,
        bio: bio,
        friends: user.friends,
      },
    };
  }

  private async getUserData(userData: GetUserDataDto): Promise<any> {
    const { type } = userData;

    if (type === 'user') {
      const user = await this.userRespository.findOne({
        where: { username: userData.username },
      });

      if (!user)
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);

      const { id, username, avatarUrl, bio, friends } = user;
      const resultUserData = {
        id: id,
        username: username,
        avatarUrl: avatarUrl,
        bio: bio,
        friends: friends,
      };
      return resultUserData;
    }

    if (type === 'friends') {
      const user = await this.userRespository.findOne({
        where: { username: userData.username },
        relations: ['friends'],
      });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const { friends } = user;

      const listFriendsRequestsId = await friends.map(async (friendsReq) => {
        const friendData = await this.userRespository.findOne({
          where: { id: friendsReq.id },
        });
        console.log(friendsReq);

        return {
          status: friendsReq.status,
          user: {
            id: friendData.id,
            username: friendData.username,
            avatarUrl: friendData.avatarUrl,
            bio: friendData.bio,
          },
        };
      });

      const listFriendsRequest = Promise.all(listFriendsRequestsId);
      return listFriendsRequest;
    }

    throw new HttpException('Invalid user type', HttpStatus.BAD_REQUEST);
  }
}
