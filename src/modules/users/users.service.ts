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
import { IUsersRepository } from './repository/i-users-repository';

@Injectable()
export class UsersService {
  constructor(
    @Inject('IUsersRepository')
    private readonly usersRepository: IUsersRepository,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const usernameAlreadyExists = await this.usersRepository.findByUsername(
      createUserDto.username,
    );

    if (usernameAlreadyExists) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Username already exists',
      });
    }

    const emailAlreadyExists = await this.usersRepository.findByEmail(
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

  async findByLogin(login: string) {
    let userExists = await this.usersRepository.findByUsername(login);

    if (userExists) {
      return new User(userExists);
    }

    userExists = await this.usersRepository.findByEmail(login);

    if (!userExists) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'User not found',
      });
    }

    return new User(userExists);
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

  async findByEmail(email: string) {
    const user = await this.usersRepository.findByEmail(email);

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

    if (updateUserDto.username) {
      const usernameAlreadyExists = await this.usersRepository.findByUsername(
        updateUserDto.username,
      );

      if (usernameAlreadyExists) {
        throw new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Username already exists',
        });
      }
    }

    if (updateUserDto.email) {
      const userEmailAlreadyExists = await this.usersRepository.findByEmail(
        updateUserDto.email,
      );

      if (userEmailAlreadyExists) {
        throw new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Email already exists',
        });
      }
    }

    const updatedUser = await this.usersRepository.updateById(
      id,
      updateUserDto,
    );

    return new User(updatedUser);
  }

  async softDelete(id: string) {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'User not found',
      });
    }

    const deletedUser = await this.usersRepository.softDelete(id);

    return new User(deletedUser);
  }
}
