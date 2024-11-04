import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateUrlDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  original_url: string;
}
