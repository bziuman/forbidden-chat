import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { MatchPasswordPipe } from './pipes/matchPassword.pipe';
import { DatabaseExceptionInterseptor } from './interceptors/dbException.interceptor';
import { JwtInterceptor } from './interceptors/jwtException.interceptor';
import { AllExceptionFilter } from './exeptionfilters/exception.filter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/db/pg/entites/user.entity';
import { AuthService } from './auth.service';
import { Session } from 'src/db/pg/entites/session.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Session]),
    JwtModule.register({
      secret: '123',
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    MatchPasswordPipe,
    DatabaseExceptionInterseptor,
    JwtInterceptor,
    AllExceptionFilter,
  ],
  exports: [
    TypeOrmModule,
    MatchPasswordPipe,
    DatabaseExceptionInterseptor,
    JwtInterceptor,
    AllExceptionFilter,
  ],
})
export class AuthModule {}
