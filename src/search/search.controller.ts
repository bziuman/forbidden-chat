import { Body, Controller, Get, UseGuards } from '@nestjs/common';
import { SearchUserDto } from './dto/searchUser.dto';
import { SearchService } from './search.service';
import { SearchedUserDto } from './dto/searchedUser.dto';
import { ValidateSearchUserPip } from './pipes/validateSearchUser.pipe';
import { AuthTokenGuard } from 'src/auth/guards/authToken.guard';

@UseGuards(AuthTokenGuard)
@Controller('/search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Get('/user')
  async getUserByName(
    @Body(new ValidateSearchUserPip()) searchUserData: SearchUserDto,
  ): Promise<SearchedUserDto> {
    return await this.searchService.getUserByName(searchUserData);
  }
}
