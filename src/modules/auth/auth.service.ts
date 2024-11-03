import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { EncryptData } from 'src/utils/encrypt-data.util';
import { CreateAuthDto } from './dto/authenticate-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private encryptData: EncryptData,
  ) {}

  async validateUser({ username, password }: CreateAuthDto): Promise<any> {
    let user = await this.usersService.findByUsername(username);

    if (!user) {
      user = await this.usersService.findByEmail(username);

      if (!user) {
        return false;
      }
    }
    const passwordHasMatch = await this.encryptData.decrypt(
      password,
      user.password,
    );

    if (!passwordHasMatch) {
      return false;
    }

    return user;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
