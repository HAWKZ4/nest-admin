import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Tag } from './model/tag.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async getTag(id: number): Promise<Tag> {
    const tag = await this.tagRepository.findOne({ where: { id } });

    if (!tag) {
      throw new NotFoundException('Tag not found!');
    }

    return tag;
  }

  async getAllTags(): Promise<Tag[]> {
    return await this.tagRepository.find({ relations: ['categories'] });
  }

  async createTag(data: CreateTagDto): Promise<Tag> {
    const { name } = data;

    const existingTag = await this.tagRepository.findOne({
      where: {
        name,
      },
    });

    if (existingTag) {
      throw new BadRequestException('Tag with this name already exists!');
    }

    const tag = this.tagRepository.create({ name });

    return await this.tagRepository.save(tag);
  }

  async deleteTag(id: number): Promise<void> {
    const result = await this.tagRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Tag not found');
    }
  }
}
