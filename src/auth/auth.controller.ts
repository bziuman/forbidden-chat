import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response, Request } from 'express';
import { SigninUserDataDto } from './dto/signinUserData.dto';
import { SignupUserDataDto } from './dto/signupUserData.dto';
import { ValidateSignupPipe } from './pipes/validateSignup.pipe';
import { MatchPasswordPipe } from './pipes/matchPassword.pipe';
import { ValidateSigninPipe } from './pipes/validateSingin.pipe';
import { AuthTokenGuard } from './guards/authToken.guard';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/sign-up')
  @UseInterceptors(FileInterceptor('avatar'))
  async signUp(
    @Body(new ValidateSignupPipe(), new MatchPasswordPipe())
    @UploadedFile()
    signupData: SignupUserDataDto,
    @Res() response: Response,
  ): Promise<Response> {
    return await this.authService.signUp(signupData, response);
  }

  //@UseGuards(AuthTokenGuard)
  @Post('/sign-in')
  async singIn(
    @Req() request: Request,
    @Body(new ValidateSigninPipe()) signinData: SigninUserDataDto,
    @Res() response: Response,
  ): Promise<Response> {
    return await this.authService.signIn(request, response, signinData);
  }

  //@UseGuards(AuthTokenGuard)
  @Post('/log-out')
  async logOut() {}
}
