import {
  Injectable,
  UseInterceptors,
  BadRequestException,
  Res,
  HttpException,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from 'src/db/pg/entites/session.entity';
import { User } from 'src/db/pg/entites/user.entity';
import { Repository } from 'typeorm';
import { SignupUserDataDto } from './dto/signupUserData.dto';
import { SigninUserDataDto } from './dto/signinUserData.dto';
import { JwtService } from '@nestjs/jwt';
import { DatabaseExceptionInterseptor } from './interceptors/dbException.interceptor';
import { JwtInterceptor } from './interceptors/jwtException.interceptor';
import { AllExceptionFilter } from './exeptionfilters/exception.filter';
import { hashPassword } from 'src/utils/hashPassword';
import { Request, Response } from 'express';
import { verifyPassword } from 'src/utils/verifyPassword';
import { saveAvatar } from 'src/utils/saveAvatar';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Session) private sessionRepository: Repository<Session>,
    private jwtService: JwtService,
  ) {}

  @UseInterceptors(DatabaseExceptionInterseptor, AllExceptionFilter)
  async signUp(
    signupData: SignupUserDataDto,
    @Res() response: Response,
  ): Promise<Response> {
    const { username, password, avatarFile, bio } = signupData;
    const checkUserExist = await this.userRepository.findOne({
      where: { username: username },
    });

    if (checkUserExist) {
      throw new BadRequestException('User with this name alredy exist');
    }

    const avatarPath = await saveAvatar({
      username: username,
      avatarFile: avatarFile,
    });

    try {
      const hashedUserPassword = await hashPassword({
        //username: username,
        password: password,
        salt: 'salt',
      });

      const user = await this.userRepository.create({
        username: username,
        password: hashedUserPassword,
        avatarUrl: avatarPath.path,
        bio: bio,
      });

      if (!user)
        throw new HttpException(
          'Failed creation user',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );

      try {
        await this.userRepository.save(user);
        return response
          .cookie('access_token', hashedUserPassword)
          .status(200)
          .json({ success: true, message: 'Succes registration new user' });
      } catch (error) {
        throw new HttpException(
          'Failed creation user',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } catch (error) {
      throw new HttpException(
        'Failed creating token',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseInterceptors(
    DatabaseExceptionInterseptor,
    JwtInterceptor,
    AllExceptionFilter,
  )
  async signIn(
    @Req() request: Request,
    @Res() response: Response,
    signinData: SigninUserDataDto,
  ): Promise<Response> {
    const { username, password } = signinData;
    const userCookieToken = request.cookies['access_token'];

    if (!userCookieToken)
      throw new HttpException('Bad token', HttpStatus.BAD_REQUEST);

    const user = await this.userRepository.findOne({
      where: { username: username },
      relations: ['friends'],
    });

    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    if (userCookieToken !== user.password)
      throw new HttpException(
        'Incorrect password or bad token',
        HttpStatus.BAD_REQUEST,
      );

    const isPasswordValide = await verifyPassword({
      username: username,
      password: password,
      heshedPassword: user.password,
      salt: 'salt',
    });

    if (!isPasswordValide) throw new BadRequestException('Password incorect');

    const session = await this.sessionRepository.create({ user: user });

    if (!session)
      throw new HttpException(
        'Error creating user session',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    await this.sessionRepository.save(session);

    const jwtToken = await this.jwtService.signAsync({
      sessionId: session.id,
      username: user.username,
    });

    user.password = jwtToken;
    await this.userRepository.save(user);
    const { avatarUrl, bio, friends } = user;
    return response
      .cookie('access_token', jwtToken)
      .cookie('session_id', session.id)
      .status(200)
      .json({
        success: true,
        message: 'Succes logged',
        user: {
          username: username,
          avatarUrl: avatarUrl,
          bio: bio,
          friends: friends,
        },
      });
  }

  async logOut() {}
}
