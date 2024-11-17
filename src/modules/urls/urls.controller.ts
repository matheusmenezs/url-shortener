import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UrlsService } from './urls.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NestResponseBuilder } from 'src/common/interceptors/nestResponseBuilder';

@ApiTags('urls')
@Controller('urls')
@ApiBearerAuth()
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createUrlDto: CreateUrlDto, @Req() req: any) {
    const urlCreated = await this.urlsService.create(createUrlDto, req.user);

    const response = new NestResponseBuilder()
      .setStatus(201)
      .setBody(urlCreated)
      .setHeaders({
        Location: urlCreated,
      })
      .build();

    return response;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Req() req: any) {
    const allUrls = this.urlsService.findAll(req.user);

    const response = new NestResponseBuilder()
      .setStatus(200)
      .setBody(allUrls)
      .build();

    return response;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUrlDto: UpdateUrlDto) {
    const updatedUrl = this.urlsService.update(id, updateUrlDto);

    const response = new NestResponseBuilder()
      .setStatus(200)
      .setBody(updatedUrl)
      .build();

    return response;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deletedUrl = await this.urlsService.softDelete(id);

    const response = new NestResponseBuilder()
      .setStatus(204)
      .setBody(deletedUrl)
      .build();

    return response;
  }
}
