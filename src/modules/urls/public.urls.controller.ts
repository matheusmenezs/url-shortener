import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UrlsService } from './urls.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('')
@ApiTags('public urls')
export class PublicUrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Post()
  create(@Body() createUrlDto: CreateUrlDto) {
    return this.urlsService.create(createUrlDto);
  }

  @Get(':short_url')
  findOne(@Param('short_url') short_url: string) {
    return this.urlsService.findByUrl(short_url);
  }
}
