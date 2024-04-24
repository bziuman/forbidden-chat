import { Body, Controller, Delete, Post } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendshipDto } from './dto/friendship.dto';
import { ValidateFriendshipDataPipe } from './pipes/validateFriendshipData.dto';
import { FriendshipResponseDto } from './dto/friendshipRespons.dto';

@Controller('/friends/:id')
export class FriendsController {
  constructor(private friendsService: FriendsService) {}

  @Post()
  async requestToFriendship(
    @Body(new ValidateFriendshipDataPipe())
    requestToFriendshipData: FriendshipDto,
  ): Promise<FriendshipResponseDto> {
    return await this.friendsService.requestToFriendship(
      requestToFriendshipData,
    );
  }

  @Post('/accept')
  async acceptFriendship(
    @Body(new ValidateFriendshipDataPipe())
    acceptFriendRequestData: FriendshipDto,
  ): Promise<FriendshipResponseDto> {
    return await this.friendsService.acceptFriendship(acceptFriendRequestData);
  }

  @Post('/reject')
  async rejectFriendship(
    @Body(new ValidateFriendshipDataPipe())
    rejectFriendshipData: FriendshipDto,
  ): Promise<FriendshipResponseDto> {
    return await this.friendsService.rejectFriendship(rejectFriendshipData);
  }

  @Delete()
  async deleteFriendship(
    @Body(new ValidateFriendshipDataPipe()) deleteFriendshipData: FriendshipDto,
  ): Promise<FriendshipResponseDto> {
    return await this.friendsService.deleteFriendship(deleteFriendshipData);
  }
}
