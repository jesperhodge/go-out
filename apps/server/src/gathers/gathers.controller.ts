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
import { AuthGuard } from '@server/auth/auth.guard'
import { Request } from 'express'
import { createClerkClient } from '@clerk/backend'

// @UseGuards(AuthGuard)
@Controller('gathers')
export class GathersController {
  constructor(private gathersService: GathersService) {}

  @Get()
  async findAll(@Query() query: ListAllEntitiesDto): Promise<Gather[]> {
    return this.gathersService.findAll(query)
  }

  @Get(':id')
  async findOne(@Param() params: { id: number }): Promise<Gather | null> {
    const gather = this.gathersService.findOne(params.id)
    if (!gather) throw new NotFoundException()

    return gather
  }

  @Post()
  async create(@Req() req: Request, @Body() createGatherDto: CreateGatherDto): Promise<Gather> {
    // const clerkClient = createClerkClient({
    //   secretKey: process.env.CLERK_SECRET_KEY,
    //   publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
    // })

    console.log('request: ', req)

    // // const { isSignedIn } = await clerkClient.authenticateRequest(req)
    // // console.log('isSignedIn: ', isSignedIn)

    return this.gathersService.create(createGatherDto)
  }

  @Post('join')
  async join(@Body() joinGatherDto: JoinGatherDto): Promise<any> {
    console.log('joinGatherDto', joinGatherDto)
    // Promise<Gather> {
    return this.gathersService.join(joinGatherDto.gatherId, joinGatherDto.userId)
  }
}
