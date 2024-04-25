import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/db/pg/entites/user.entity';
import { Friend } from 'src/db/pg/entites/friend.entity';
import { JwtModule } from '@nestjs/jwt';
import { DecodedTokenMiddleware } from './middleware/decodeTokenMiddleware.middleware';
import { RemoveTokenUserDataMiddleware } from './middleware/removeTokenUserData.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Friend]),
    JwtModule.register({
      secret: '123',
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [TypeOrmModule],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(DecodedTokenMiddleware, RemoveTokenUserDataMiddleware)
      .forRoutes(UserController);
  }
}
