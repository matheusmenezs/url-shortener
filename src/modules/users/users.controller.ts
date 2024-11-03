import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiProperty, ApiTags } from '@nestjs/swagger';
import { NestResponseBuilder } from 'src/common/interceptors/nestResponseBuilder';
import { UserPipe } from './user.pipe';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body(UserPipe) createUserDto: CreateUserDto) {
    const newUser = await this.usersService.create(createUserDto);

    const response = new NestResponseBuilder()
      .setStatus(HttpStatus.CREATED)
      .setHeaders({ Location: `/users/${newUser.id}` })
      .setBody(newUser)
      .build();

    return response;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiBearerAuth()
  async findAll() {
    const allUsers = await this.usersService.findAll();

    const response = new NestResponseBuilder()
      .setStatus(HttpStatus.OK)
      .setBody(allUsers)
      .build();

    return response;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiBearerAuth()
  @ApiProperty()
  async findOne(@Param('id') id: string) {
    const userFound = await this.usersService.findById(id);

    const response = new NestResponseBuilder()
      .setStatus(HttpStatus.OK)
      .setBody(userFound)
      .build();

    return response;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiProperty()
  async update(
    @Param('id') id: string,
    @Body(UserPipe) updateUserDto: UpdateUserDto,
  ) {
    const updatedUser = await this.usersService.update(id, updateUserDto);

    const response = new NestResponseBuilder()
      .setStatus(HttpStatus.OK)
      .setHeaders({ Location: `/users/${updatedUser.id}` })
      .setBody(updatedUser)
      .build();

    return response;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiProperty()
  async softDelete(@Param('id') id: string) {
    const deletedUser = await this.usersService.softDelete(id);

    const response = new NestResponseBuilder()
      .setStatus(HttpStatus.OK)
      .setBody(deletedUser)
      .build();

    return response;
  }
}
