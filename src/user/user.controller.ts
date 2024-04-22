import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthTokenGuard } from 'src/auth/guards/authToken.guard';
import { UserDto } from './dto/user.dto';
import { FriendRequestDto } from './dto/friendRequest.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateAvatarDto } from './dto/updateAvatar.dto';

@UseGuards(AuthTokenGuard)
@Controller('/users/:id')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getUser(@Param('id') id: number): Promise<UserDto> {
    return await this.userService.getUser(id);
  }

  @Get('/friends')
  async getFriends(@Param() id: number): Promise<object> {
    return await this.userService.getFriends(id);
  }

  @Get('/friends-requests')
  async getFriendsRequests(@Body() friendRequestData: FriendRequestDto) {
    return await this.userService.getFriendRequest(friendRequestData);
  }

  @Put('/avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  async updateUserAvatar(
    @Param('id') @UploadedFile() updateAvatarFile: UpdateAvatarDto,
  ) {
    return await this.userService.updateUserAvatar(updateAvatarFile);
  }

  @Put('bio')
  async updateUserBio(@Param('id') userId: number, @Body('bio') bio: string) {
    return await this.userService.updateUserBio(userId, bio);
  }
}
