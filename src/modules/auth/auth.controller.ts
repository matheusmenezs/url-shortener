import {
  Controller,
  Get,
  Post,
  UseGuards,
  Req,
  HttpStatus,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ApiBody, ApiProperty } from '@nestjs/swagger';
import { NestResponseBuilder } from 'src/common/interceptors/nestResponseBuilder';
import { CreateAuthDto } from './dto/authenticate-user.dto';

export class LoginDto {
  username: string;
  password: string;
}

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({
    type: CreateAuthDto,
    examples: {
      example: {
        value: { username: 'user', password: 'Password123!' },
      },
    },
  })
  async login(@Body() authDto: CreateAuthDto, @Req() req: any) {
    const token = await this.authService.login(req.user);

    const response = new NestResponseBuilder()
      .setStatus(HttpStatus.OK)
      .setBody(token)
      .build();

    return response;
  }

  @ApiProperty()
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: any) {
    return req.user;
  }
}
