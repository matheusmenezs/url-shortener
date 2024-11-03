import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAuthDto {
  @ApiProperty()
  @IsNotEmpty({
    message: 'Username is missing',
  })
  username: string;

  @ApiProperty()
  @IsNotEmpty({
    message: 'Password is missing',
  })
  @IsString({
    message: 'Field password is invalid format',
  })
  password: string;
}
