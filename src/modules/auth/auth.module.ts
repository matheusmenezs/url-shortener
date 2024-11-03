import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';

import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthController } from './auth.controller';
import { EncryptData } from 'src/utils/encrypt-data.util';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, EncryptData, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
