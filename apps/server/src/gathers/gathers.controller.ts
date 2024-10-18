import {
  Body,
  Query,
  Controller,
  Get,
  Param,
  Post,
  NotFoundException,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Req,
} from '@nestjs/common'
import { CreateGatherDto, ListAllEntitiesDto, JoinGatherDto } from './dto/gathers.dto'
import { GathersService } from './gathers.service'
import { Gather } from '@prisma/client'
import { AuthGuard } from '~/auth/auth.guard'
import { Request } from 'express'
import { createClerkClient } from '@clerk/backend'

@UseGuards(AuthGuard)
@Controller('gathers')
export class GathersController {
  constructor(private gathersService: GathersService) {}

  @Get()
  async findAll(@Query() query: ListAllEntitiesDto): Promise<Gather[]> {
    return await this.gathersService.findAll(query)
  }

  @Get(':id')
  async findOne(@Param() params: { id: number }): Promise<Gather | null> {
    const gather = this.gathersService.findOne(params.id)
    if (!gather) throw new NotFoundException()

    return gather
  }

  @Post()
  async create(@Req() req: Request, @Body() createGatherDto: CreateGatherDto): Promise<Gather> {
    console.log('request: ', req)

    return await this.gathersService.create(createGatherDto)
  }

  @Post('join')
  async join(@Req() req: Request, @Body() joinGatherDto: JoinGatherDto): Promise<any> {
    console.log('joinGatherDto', joinGatherDto)
    // Promise<Gather> {
    return await this.gathersService.join(joinGatherDto.gatherId)
  }
}
