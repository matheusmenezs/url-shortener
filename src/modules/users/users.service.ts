import { UsersRepository } from './repository/user.repository';
import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @Inject('UsersRepository')
    private readonly usersRepository: UsersRepository,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const usernameAlreadyExists = this.usersRepository.findByUsername(
      createUserDto.username,
    );

    if (usernameAlreadyExists) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Username already exists',
      });
    }

    const emailAlreadyExists = this.usersRepository.findByEmail(
      createUserDto.email,
    );

    if (emailAlreadyExists) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Email already exists',
      });
    }

    const newUser = await this.usersRepository.create(createUserDto);

    return new User(newUser);
  }

  async findAll() {
    const allUsers = await this.usersRepository.findAll();

    return allUsers.map((user) => new User(user));
  }

  async findById(id: string) {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'User not found',
      });
    }

    return new User(user);
  }

  async findByUsername(username: string) {
    const user = await this.usersRepository.findByUsername(username);

    if (!user) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'User not found',
      });
    }

    return new User(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'User not found',
      });
    }

    const updatedUser = await this.usersRepository.updateById(
      id,
      updateUserDto,
    );

    return new User(updatedUser);
  }

  async remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
