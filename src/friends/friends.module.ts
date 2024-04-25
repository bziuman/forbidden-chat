import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friend } from 'src/db/pg/entites/friend.entity';
import { User } from 'src/db/pg/entites/user.entity';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';
import { DecodedTokenMiddleware } from 'src/user/middleware/decodeTokenMiddleware.middleware';
import { RemoveTokenUserDataMiddleware } from 'src/user/middleware/removeTokenUserData.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([User, Friend])],
  controllers: [FriendsController],
  providers: [FriendsService],
  exports: [TypeOrmModule],
})
export class FriendsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(DecodedTokenMiddleware, RemoveTokenUserDataMiddleware)
      .forRoutes(FriendsController);
  }
}
