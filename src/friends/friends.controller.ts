import { Body, Controller, Delete, Post, Req } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendshipDto } from './dto/friendship.dto';
import { ValidateFriendshipDataPipe } from './pipes/validateFriendshipData.dto';
import { FriendshipResponseDto } from './dto/friendshipRespons.dto';

@Controller('/friends/:id')
export class FriendsController {
  constructor(private friendsService: FriendsService) {}

  @Post()
  async requestToFriendship(
    @Req() request: any,
    @Body(new ValidateFriendshipDataPipe())
    requestToFriendshipData: FriendshipDto,
  ): Promise<FriendshipResponseDto> {
    return await this.friendsService.requestToFriendship(
      request,
      requestToFriendshipData,
    );
  }

  @Post('/accept')
  async acceptFriendship(
    @Req() request: any,
    @Body(new ValidateFriendshipDataPipe())
    acceptFriendRequestData: FriendshipDto,
  ): Promise<FriendshipResponseDto> {
    return await this.friendsService.acceptFriendship(
      request,
      acceptFriendRequestData,
    );
  }

  @Post('/reject')
  async rejectFriendship(
    @Req() request: any,
    @Body(new ValidateFriendshipDataPipe())
    rejectFriendshipData: FriendshipDto,
  ): Promise<FriendshipResponseDto> {
    return await this.friendsService.rejectFriendship(
      request,
      rejectFriendshipData,
    );
  }

  @Delete()
  async deleteFriendship(
    @Req() request: any,
    @Body(new ValidateFriendshipDataPipe()) deleteFriendshipData: FriendshipDto,
  ): Promise<FriendshipResponseDto> {
    return await this.friendsService.deleteFriendship(
      request,
      deleteFriendshipData,
    );
  }
}
