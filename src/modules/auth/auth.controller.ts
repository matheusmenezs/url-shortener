import {
  Controller,
  Get,
  Post,
  UseGuards,
  Req,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ApiBody, ApiProperty, ApiTags } from '@nestjs/swagger';
import { NestResponseBuilder } from 'src/common/interceptors/nestResponseBuilder';
import { CreateAuthDto } from './dto/authenticate-user.dto';

export interface IUserRequestData {
  user: {
    id: string;
    username: string;
  };
}
@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({
    type: CreateAuthDto,
    examples: {
      firstExample: {
        value: { login: 'user@email.com', password: 'Password123!' },
      },
      secondExample: {
        value: { username: 'user', password: 'Password123!' },
      },
    },
  })
  async login(@Req() { user }: IUserRequestData) {
    const token = await this.authService.login(user);

    const response = new NestResponseBuilder()
      .setStatus(HttpStatus.OK)
      .setBody(token)
      .build();

    return response;
  }

  @ApiProperty()
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: IUserRequestData) {
    return req.user;
  }
}
