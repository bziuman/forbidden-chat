import { Friend } from 'src/db/pg/entites/friend.entity';

export class SearchedUserDto {
  id: number;
  username: string;
  avatar: string;
  bio: string;
  friends: Friend[];
}
