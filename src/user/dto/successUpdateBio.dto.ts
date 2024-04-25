import { Friend } from 'src/db/pg/entites/friend.entity';

export class SuccessUpdateBioDto {
  success: boolean;
  user: {
    id: number;
    username: string;
    avatarUrl: string;
    bio: string;
    friends: Friend[];
  };
}
