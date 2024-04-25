import { Friend } from 'src/db/pg/entites/friend.entity';

export class GetUserDto {
  id: number;
  username: string;
  avatarUrl: string;
  bio: string;
  friedns: Friend[];
}
