import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    const urlExists = await this.urlsRepository.findByUser(user.id);

    if (!urlExists) {
      throw new NotFoundException('URL not found');
    }

    return urlExists;
  }

  async findById(id: string) {
    const urlExists = await this.urlsRepository.findById(id);

    if (!urlExists) {
      throw new NotFoundException('URL not found');
    }

    return urlExists;
  }

  async findByUrl(short_url: string) {
    const urlExists = await this.urlsRepository.findByShortUrl(short_url);

    if (!urlExists) {
      throw new NotFoundException('URL not found');
    }

    urlExists.visits += 1;
    const updatedUrl = await this.urlsRepository.update(urlExists);

    if (!updatedUrl) {
      throw new BadRequestException('URL not updated');
    }

    return updatedUrl?.original_url;
  }

  async create(data: CreateUrlDto, user?: User) {
    const urlData = {
      ...data,
      user_id: user?.id || null,
      short_url: this.generateShortUrl(),
    };

    const shortUrlExists = await this.urlsRepository.findByShortUrl(
      urlData.short_url,
    );

    if (shortUrlExists) {
      urlData.short_url = this.generateShortUrl();
    }

    const url = await this.urlsRepository.create(urlData);

    const response = {
      short_url: `${process.env.BASE_URL}/${url.short_url}`,
    };

    return response;
  }

  async update(id: string, data: UpdateUrlDto) {
    const url = await this.findById(id);

    if (!url) {
      throw new NotFoundException('URL not found');
    }

    url.original_url = data.original_url;
    const updatedUrl = await this.urlsRepository.update(url);

    return updatedUrl;
  }

  async softDelete(id: string) {
    const urlExists = await this.urlsRepository.findById(id);

    if (!urlExists) {
      throw new NotFoundException('URL not found');
    }

    const deletedUrl = await this.urlsRepository.softDelete(id);

    return deletedUrl;
  }
}
