import { Friend } from 'src/db/pg/entites/friend.entity';

export class UserDto {
  id: number;
  username: string;
  friends: Friend;
  avatarUrl: string;
  bio: string;
}
