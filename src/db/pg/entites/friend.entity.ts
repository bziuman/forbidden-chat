import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { FriendshipStatus } from 'src/friends/enum/friendshipStatus.enum';

@Entity()
export class Friend extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.friends)
  user: User;

  @ManyToOne(() => User)
  friend: User;

  @Column({ default: FriendshipStatus.Pending })
  status: FriendshipStatus;
}
