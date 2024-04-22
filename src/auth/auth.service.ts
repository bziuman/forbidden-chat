import {
  Injectable,
  UseInterceptors,
  BadRequestException,
  Res,
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
import * as path from 'node:path';
import { AvatarPathDto } from './dto/avatarPath.dto';
import { hashPassword } from 'src/utils/hashPassword';
import { Signup200Dto } from './dto/200signup.dto';
import { Response } from 'express';
import { verifyPassword } from 'src/utils/verifyPassword';
import { writeFile } from 'node:fs/promises';

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
    avatar: Express.Multer.File,
  ): Promise<Signup200Dto> {
    const { username, password, bio } = signupData;
    const checkUserExist = await this.userRepository.findOne({
      where: { username: username },
    });

    if (checkUserExist) {
      throw new BadRequestException('User with this name alredy exist');
    }
    const hashedUserPassword = await hashPassword({
      password: password,
      salt: 'salt',
    });
    const avatarPath = await this.saveAvatar(username, avatar);
    const user = await this.userRepository.create({
      username: username,
      password: hashedUserPassword,
      avatarUrl: avatarPath.path,
      bio: bio,
    });

    try {
      await this.userRepository.save(user);
      return { success: true, message: 'Succes registration new user' };
    } catch (error) {
      return { success: false, message: 'Faild registration' };
    }
  }

  @UseInterceptors(
    DatabaseExceptionInterseptor,
    JwtInterceptor,
    AllExceptionFilter,
  )
  async signIn(
    signinData: SigninUserDataDto,
    @Res() response: Response,
  ): Promise<Response> {
    const { username, password } = signinData;

    const user = await this.userRepository.findOne({
      where: { username: username },
      relations: ['friends'],
    });

    const isPasswordValide = await verifyPassword({
      password: password,
      heshedPassword: user.password,
      salt: 'salt',
    });

    if (!isPasswordValide) throw new BadRequestException('Password incorect');

    const jwtToken = await this.jwtService.signAsync({
      id: user.id,
      username: user.username,
    });

    return response
      .cookie('access_token', jwtToken)
      .status(200)
      .json({ success: true, message: 'Succes logged' });
  }

  async logOut() {}

  async saveAvatar(
    username: string,
    avatar: Express.Multer.File,
  ): Promise<AvatarPathDto> {
    if (!avatar) return { success: false, path: '' };
    const pathAvatarSave = path.join(
      `/Users/bohdanziuman/Desktop/forbidden-chat/upload-files/UsersAvatars`,
      `${username}${avatar.originalname}`,
    );

    await writeFile(pathAvatarSave, avatar.buffer);

    return { success: true, path: pathAvatarSave };
  }
}
