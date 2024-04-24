import { Body, Controller, Get } from '@nestjs/common';
import { SearchUserDto } from './dto/searchUser.dto';
import { SearchService } from './search.service';
import { SearchedUserDto } from './dto/searchedUser.dto';
import { ValidateFriendshipDataPipe } from 'src/friends/pipes/validateFriendshipData.dto';

@Controller('/search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Get('/user')
  async getUserByName(
    @Body(new ValidateFriendshipDataPipe()) seachedUserData: SearchUserDto,
  ): Promise<SearchedUserDto> {
    return await this.searchService.getUserByName(seachedUserData);
  }
}
