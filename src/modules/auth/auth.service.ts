import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { EncryptData } from 'src/utils/encrypt-data.util';
import { CreateAuthDto } from './dto/authenticate-user.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private encryptData: EncryptData,
  ) {}

  async validateUser({
    login,
    password,
  }: CreateAuthDto): Promise<User | false> {
    const user = await this.usersService.findByLogin(login);

    const passwordHasMatch = await this.encryptData.decrypt(
      password,
      user.password,
    );

    if (!passwordHasMatch) {
      return false;
    }

    return new User(user);
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
