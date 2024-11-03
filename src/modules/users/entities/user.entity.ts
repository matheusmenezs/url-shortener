import { Exclude } from 'class-transformer';

export class User {
  id: string;
  email: string;
  username: string;

  @Exclude()
  password: string;

  created_at: Date;
  updated_at?: Date;
  deleted_at?: Date;

  constructor(user: Partial<User>) {
    Object.assign(this, user);
  }
}
