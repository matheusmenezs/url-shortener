import { Module } from '@nestjs/common';
import { UrlsService } from './urls.service';
import { UrlsController } from './urls.controller';
import { PrismaService } from 'src/infra/database/prisma.service';
import { UrlsRepository } from './repository/urls.repository';
import { PublicUrlsController } from './public.urls.controller';

@Module({
  controllers: [UrlsController, PublicUrlsController],
  providers: [
    UrlsService,
    PrismaService,
    {
      provide: 'UrlsRepository',
      useClass: UrlsRepository,
    },
  ],
})
export class UrlsModule {}
