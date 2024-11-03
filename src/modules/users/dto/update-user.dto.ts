import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsEmpty, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional()
  @IsEmail(
    {},
    {
      message: 'Email must be a valid email address',
    },
  )
  email?: string;

  @ApiPropertyOptional()
  @IsString({
    message: 'Username must be a string',
  })
  username?: string;

  @ApiPropertyOptional()
  @IsString({
    message: 'Password must be a string',
  })
  password?: string;

  @IsEmpty()
  deleted_at?: null | Date;
}
