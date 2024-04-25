import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Friend } from './friend.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  username: string;

  @Column()
  password: string;

  @Column({ default: 'user' })
  role: string;

  @OneToMany(() => Friend, (friends) => friends.friend)
  friends: Friend[];

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ nullable: true })
  bio: string;
}
