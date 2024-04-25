import { Friend } from 'src/db/pg/entites/friend.entity';
import { FriendshipStatus } from 'src/friends/enum/friendshipStatus.enum';

export class StatusFriendshipListRequestDto {
  status: boolean;
  friends: {
    id: number;
    username: string;
    avatarUrl: string;
    bio: string;
    friends: Friend[];
  }[];
}
