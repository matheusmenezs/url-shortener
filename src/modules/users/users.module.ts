import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './repository/user.repository';
import { PrismaService } from 'src/infra/database/prisma.service';
import { EncryptData } from 'src/utils/encrypt-data.util';
import { UserPipe } from './user.pipe';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    PrismaService,
    {
      provide: 'UsersRepository',
      useClass: UsersRepository,
    },
    EncryptData,
    UserPipe,
  ],
  exports: [UsersService],
})
export class UsersModule {}
