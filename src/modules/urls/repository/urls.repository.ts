import { Injectable } from '@nestjs/common';

import { Url } from '@prisma/client';
import { PrismaService } from 'src/infra/database/prisma.service';

@Injectable()
export class UrlsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByUser(user_id: string) {
    return this.prisma.url.findMany({
      where: { user_id },
      include: { user: true },
    });
  }

  async findAll(where: any) {
    return this.prisma.url.findMany({
      where,
      include: { user: true },
    });
  }

  async findByShortUrl(short_url: string) {
    return this.prisma.url.findUnique({
      where: { short_url },
    });
  }

  async findByOriginalUrl(original_url: string) {
    return this.prisma.url.findUnique({
      where: { original_url },
    });
  }

  async findById(id: string) {
    return this.prisma.url.findUnique({
      where: { id },
      include: { user: true },
    });
  }

  async create(data: any): Promise<Url> {
    return this.prisma.url.create({
      data,
    });
  }

  async update(url: any) {
    return this.prisma.url.update({
      where: { id: url.id },
      data: url,
    });
  }

  async softDelete(id: string) {
    return this.prisma.url.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
  }
}
