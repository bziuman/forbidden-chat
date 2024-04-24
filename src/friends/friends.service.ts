import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Friend } from 'src/db/pg/entites/friend.entity';
import { User } from 'src/db/pg/entites/user.entity';
import { Repository } from 'typeorm';
import { FriendshipStatus } from './enum/friendshipStatus.enum';
import { FriendshipDto } from './dto/friendship.dto';
import { FriendshipResponseDto } from './dto/friendshipRespons.dto';

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Friend) private friendRepository: Repository<Friend>,
  ) {}

  async requestToFriendship(
    requestToFriendshipData: FriendshipDto,
  ): Promise<FriendshipResponseDto> {
    return await this.updateFriendshipStatus(requestToFriendshipData);
  }

  async acceptFriendship(
    acceptFriendRequestData: FriendshipDto,
  ): Promise<FriendshipResponseDto> {
    return await this.updateFriendshipStatus(acceptFriendRequestData);
  }

  async rejectFriendship(
    rejectFriendshipData: FriendshipDto,
  ): Promise<FriendshipResponseDto> {
    return await this.updateFriendshipStatus(rejectFriendshipData);
  }

  async deleteFriendship(
    deleteFriendshipData: FriendshipDto,
  ): Promise<FriendshipResponseDto> {
    return await this.updateFriendshipStatus(deleteFriendshipData);
  }

  private async updateFriendshipStatus(
    updateFriendshipData: FriendshipDto,
  ): Promise<FriendshipResponseDto> {
    const { username, friendName, status } = updateFriendshipData;
    const user = await this.userRepository.findOne({
      where: { username: username },
    });

    if (!user)
      throw new HttpException(
        'The user who sent the friend request was not found',
        HttpStatus.NOT_FOUND,
      );

    const friend = await this.userRepository.findOne({
      where: { username: friendName },
    });

    if (!friend)
      throw new HttpException(
        'The user to whom the friend request was sent was not found',
        HttpStatus.NOT_FOUND,
      );

    const friendship = await this.friendRepository.findOne({
      where: { user: user, friend: friend },
    });

    if (!friendship)
      if (status === FriendshipStatus.Pending) {
        //Createing friendship between two user
        const newFriendship = await this.friendRepository.create({
          user: user,
          friend: friend,
          status: status,
        });

        if (!newFriendship)
          throw new HttpException(
            'Error creating friendship',
            HttpStatus.BAD_REQUEST,
          );

        await this.friendRepository.save(newFriendship);

        const successFriendshipResponse = {
          success: true,
          message: 'Friend invitation sent successfully',
        };

        return successFriendshipResponse;
      } else {
        throw new HttpException(
          'Friendship between users not found',
          HttpStatus.NOT_FOUND,
        );
      }

    if (status === FriendshipStatus.Delete) {
      //deleting an entry from the friends table
      await this.friendRepository.remove(friendship);

      const successFriendshipResponse = {
        success: true,
        message: 'The user was successfully unfriended',
      };

      return successFriendshipResponse;
    }

    /*
      update status friendship to
      -accept
      -reject
    */
    friendship.status = status;
    await this.friendRepository.save(friendship);

    const successFriendshipResponse = {
      success: true,
      message: `The friend request status has been successfully changed to ${status}`,
    };

    return successFriendshipResponse;
  }
}
