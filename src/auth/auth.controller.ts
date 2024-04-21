import {
  Body,
  Controller,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { SigninUserDataDto } from './dto/signinUserData.dto';
import { SignupUserDataDto } from './dto/signupUserData.dto';
import { Signup200Dto } from './dto/200signup.dto';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/sign-up')
  @UseInterceptors(FileInterceptor('avatar'))
  async signUp(
    @Body() signupData: SignupUserDataDto,
    @UploadedFile() avatar,
  ): Promise<Signup200Dto> {
    return await this.authService.signUp(signupData, avatar);
  }

  @Post('/sign-in')
  async singIn(
    @Body() signinData: SigninUserDataDto,
    @Res() response: Response,
  ): Promise<Response> {
    return await this.authService.signIn(signinData, response);
  }

  @Post('/log-out')
  async logOut() {}
}
