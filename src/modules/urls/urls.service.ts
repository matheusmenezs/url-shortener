import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
import { User } from '../users/entities/user.entity';
import { UrlsRepository } from './repository/urls.repository';
import { randomBytes } from 'crypto';

@Injectable()
export class UrlsService {
  constructor(
    @Inject('UrlsRepository')
    private readonly urlsRepository: UrlsRepository,
  ) {}

  generateShortUrl(): string {
    const alphanumericCharacters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const alphanumericLength = alphanumericCharacters.length;
    let result = '';

    const randomBytesArray = randomBytes(6);

    for (let i = 0; i < 6; i++) {
      const randomIndex = randomBytesArray[i] % alphanumericLength;
      result += alphanumericCharacters.charAt(randomIndex);
    }

    return result;
  }

  async findAll(user?: User) {
    return await this.urlsRepository.findByUser(user.id);
  }

  async findById(id: string) {
    try {
      return await this.urlsRepository.findById(id);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async findByUrl(short_url: string) {
    try {
      const url = await this.urlsRepository.findByShortUrl(short_url);

      if (url) {
        url.visits += 1;
        await this.urlsRepository.update(url);
      }
      return url.original_url;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async create(data: CreateUrlDto, user?: User) {
    const urlData = {
      ...data,
      user_id: user?.id || null,
      short_url: this.generateShortUrl(),
    };

    const url = await this.urlsRepository.create(urlData);

    const response = {
      short_url: `${process.env.BASE_URL}/${url.short_url}`,
    };

    return response;
  }

  async update(id: string, data: UpdateUrlDto) {
    const url = await this.findById(id);
    url.original_url = data.original_url;
    await this.urlsRepository.update(url);
    return url;
  }

  async softDelete(id: string) {
    const urlExists = await this.urlsRepository.findById(id);

    if (!urlExists) {
      throw new NotFoundException('URL not found');
    }

    await this.urlsRepository.softDelete(id);
  }
}
