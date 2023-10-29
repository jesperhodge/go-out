import { Body, Query, Controller, Get, Param, Post, NotFoundException, UsePipes, ValidationPipe } from '@nestjs/common'
import { CreateGatherDto, ListAllEntitiesDto, JoinGatherDto } from './dto/gathers.dto'
import { GathersService } from './gathers.service'
import { Gather } from '@prisma/client'

@Controller('gathers')
export class GathersController {
  constructor(private gathersService: GathersService) {}

  @Get()
  async findAll(@Query() query: ListAllEntitiesDto): Promise<Gather[]> {
    console.log(query)
    return this.gathersService.findAll(query)
  }

  @Get(':id')
  async findOne(@Param() params: { id: number }): Promise<Gather | null> {
    console.log(params.id)
    const gather = this.gathersService.findOne(params.id)
    if (!gather) throw new NotFoundException()

    return gather
  }

  @Post()
  async create(@Body() createGatherDto: CreateGatherDto): Promise<Gather> {
    console.log(createGatherDto)

    return this.gathersService.create(createGatherDto)
  }

  @Post('join')
  async join(@Body() joinGatherDto: JoinGatherDto): Promise<Gather> {
    console.log(joinGatherDto)

    return this.gathersService.join(joinGatherDto.gatherId, joinGatherDto.userId)
  }
}
