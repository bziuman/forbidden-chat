import { FriendshipStatus } from '../enum/friendshipStatus.enum';

export class FriendshipDto {
  username: string;
  friendName: string;
  status: FriendshipStatus;
}
