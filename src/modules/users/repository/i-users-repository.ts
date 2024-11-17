import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';

export interface IUsersRepository {
  create(createUserDto: CreateUserDto): Promise<User | null>;
  findById(id: string): Promise<User>;
  findByUsername(username: string): Promise<User | null>;
  updateById(id: string, updateUserDto: UpdateUserDto): Promise<User | null>;
  softDelete(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(): Promise<User[]>;
}
