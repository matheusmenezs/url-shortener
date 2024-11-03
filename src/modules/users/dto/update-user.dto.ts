import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsDate, IsEmail, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsEmail(
    {},
    {
      message: 'Email must be a valid email address',
    },
  )
  email?: string;

  @IsString({
    message: 'Username must be a string',
  })
  username?: string;

  @IsString({
    message: 'Password must be a string',
  })
  password?: string;

  @IsDate({
    message: 'Deleted at must be a date',
  })
  deleted_at?: Date;
}
