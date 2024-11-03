import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';
import { IUsersRepository } from './i-users-repository';

@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create({ email, username, password }: CreateUserDto): Promise<User> {
    const newUser = await this.prismaService.user.create({
      data: {
        username,
        email,
        password,
      },
    });
    return newUser;
  }

  async updateById(
    id: string,
    { username, email, password, deleted_at }: UpdateUserDto,
  ): Promise<User> {
    const updatedUser = await this.prismaService.user.update({
      where: { id },
      data: {
        username,
        email,
        password,
        deleted_at,
      },
    });

    return updatedUser;
  }

  async softDelete(id: string): Promise<User> {
    const deletedUser = await this.prismaService.user.update({
      where: { id },
      data: { deleted_at: new Date() },
    });

    return deletedUser;
  }

  async findById(id: string): Promise<User> {
    const userFound = await this.prismaService.user.findFirst({
      where: { id },
    });

    return userFound;
  }

  async findByUsername(username: string): Promise<User> {
    const userFound = await this.prismaService.user.findFirst({
      where: { username },
    });

    return userFound;
  }

  async findByEmail(email: string): Promise<User> {
    const userFound = await this.prismaService.user.findFirst({
      where: { email },
    });

    return userFound;
  }

  async findAll(): Promise<User[]> {
    const allUsers = await this.prismaService.user.findMany();
    return allUsers;
  }
}
