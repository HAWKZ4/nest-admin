import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';

@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  async createTag(@Body() body: CreateTagDto) {
    return await this.tagService.createTag(body);
  }

  @Get()
  async getAllTags() {
    return await this.tagService.getAllTags();
  }

  @Delete('/:id')
  async deleteTag(@Param('id') id: number) {
    return await this.tagService.deleteTag(id);
  }

  @Get('/:id')
  async getTag(@Param('id') id: number) {
    return await this.tagService.getTag(id);
  }
}
