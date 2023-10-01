import {
  Body,
  Query,
  Controller,
  Get,
  Param,
  Post,
  NotFoundException,
} from '@nestjs/common';
import { Gather } from '@customTypes/gather';
import {
  CreateGatherDto,
  ListAllEntities,
  JoinGatherDto,
} from './dto/gathers.dto';
import { GathersService } from './gathers.service';

@Controller('gathers')
export class GathersController {
  constructor(private gathersService: GathersService) {}

  @Get()
  async findAll(@Query() query: ListAllEntities): Promise<Gather[]> {
    console.log(query);
    return this.gathersService.findAll();
  }

  @Get(':id')
  async findOne(@Param() params: { id: string }): Promise<Gather | undefined> {
    console.log(params.id);
    const gather = this.gathersService.findOne(params.id);
    if (!gather) throw new NotFoundException();

    return gather;
  }

  @Post()
  async create(@Body() createGatherDto: CreateGatherDto): Promise<Gather> {
    console.log(createGatherDto);

    return this.gathersService.create(createGatherDto.gather);
  }

  @Post('join')
  async join(@Body() joinGatherDto: JoinGatherDto): Promise<Gather> {
    console.log(joinGatherDto);

    return this.gathersService.join(
      joinGatherDto.gatherId,
      joinGatherDto.userId,
    );
  }
}
