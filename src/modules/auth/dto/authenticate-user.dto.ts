import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAuthDto {
  @ApiProperty()
  @IsNotEmpty({
    message: 'Login is missing',
  })
  login: string;

  @ApiProperty()
  @IsNotEmpty({
    message: 'Password is missing',
  })
  @IsString({
    message: 'Field password is invalid format',
  })
  password: string;
}
