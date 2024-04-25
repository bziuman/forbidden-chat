import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/db/pg/entites/user.entity';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: '123',
    }),
  ],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
