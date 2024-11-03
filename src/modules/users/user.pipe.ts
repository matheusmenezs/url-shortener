import {
  PipeTransform,
  Injectable,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EncryptData } from 'src/utils/encrypt-data.util';

@Injectable()
export class UserPipe implements PipeTransform {
  constructor(private readonly encryptData: EncryptData) {}
  async transform({
    username,
    email,
    password,
  }: CreateUserDto | UpdateUserDto): Promise<CreateUserDto | UpdateUserDto> {
    const user = {
      username: username,
      email: email,
      password: password,
    };

    if (password) {
      const passwordHasValid = password.match(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[.!?$%_-])[A-Za-z\d.!?$%_-]{10,}$/g,
      );

      if (!passwordHasValid) {
        throw new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          message:
            'Must have at least 10 characters, including one uppercase letter, one lowercase letter, one digit, and one special character.',
        });
      }

      const passwordHash = await this.encryptData.encrypt(password, 10);
      user.password = passwordHash;
    }

    return user;
  }
}
