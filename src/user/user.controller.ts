import {
  Body,
  Controller,
  Get,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthTokenGuard } from 'src/auth/guards/authToken.guard';
import { UserDto } from './dto/user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateBioDto } from './dto/updateBio.dto';
import { FriendsListDto } from './dto/friendsList.dto';
import { StatusFriendshipListRequestDto } from './dto/statusFriendshipRequest.dto';
import { SuccessUpdateAvatarDto } from './dto/successUpdateAvatar.dto';
import { SuccessUpdateBioDto } from './dto/successUpdateBio.dto';

@UseGuards(AuthTokenGuard)
@Controller('/users/:id')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getUser(@Req() request: any): Promise<UserDto> {
    return await this.userService.getUser(request);
  }

  @Get('/friends')
  async getFriends(@Req() request: any): Promise<FriendsListDto> {
    return await this.userService.getFriends(request);
  }

  @Get('/friends-requests')
  async getFriendsRequests(
    @Req() request: any,
  ): Promise<StatusFriendshipListRequestDto> {
    return await this.userService.getFriendRequest(request);
  }

  @Put('/avatar')
  @UseInterceptors(FileInterceptor('avatarFile'))
  async updateUserAvatar(
    @Req() request: any,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<SuccessUpdateAvatarDto> {
    return await this.userService.updateUserAvatar(request, file);
  }

  @Put('/bio')
  async updateUserBio(
    @Req() request: any,
    @Body() updateBioData: UpdateBioDto,
  ): Promise<SuccessUpdateBioDto> {
    return await this.userService.updateUserBio(request, updateBioData);
  }
}
