import { Body, Query, Controller, Get, Param, Post } from '@nestjs/common';
import { Gather } from '@customTypes/gather';
import {
  CreateGatherDto,
  ListAllEntities,
  JoinGatherDto,
} from './dto/gathers.dto';

@Controller('gathers')
export class GathersController {
  @Get()
  async findAll(@Query() query: ListAllEntities): Promise<Gather[]> {
    console.log(query);
    return [
      {
        id: '1',
        name: 'Gather 1',
        location: {
          googleId: '1',
          name: 'Gather 1',
          formattedAddress: 'Gather 1',
          lat: 1,
          lng: 1,
        },
        participants: [
          {
            id: '1',
            name: 'Participant 1',
          },
        ],
      },
    ];
  }

  @Get(':id')
  async findOne(@Param() params: { id: string }): Promise<Gather> {
    console.log(params.id);
    return {
      id: '1',
      name: 'Gather 1',
      location: {
        googleId: '1',
        name: 'Gather 1',
        formattedAddress: 'Gather 1',
        lat: 1,
        lng: 1,
      },
      participants: [
        {
          id: '1',
          name: 'Participant 1',
        },
      ],
    };
  }

  @Post()
  async create(@Body() createGatherDto: CreateGatherDto): Promise<Gather> {
    console.log(createGatherDto);
    return {
      id: '1',
      name: 'Gather 1',
      location: {
        googleId: '1',
        name: 'Gather 1',
        formattedAddress: 'Gather 1',
        lat: 1,
        lng: 1,
      },
      participants: [
        {
          id: '1',
          name: 'Participant 1',
        },
      ],
    };
  }

  @Post('join')
  async join(@Body() joinGatherDto: JoinGatherDto): Promise<Gather> {
    console.log(joinGatherDto);
    return {
      id: '1',
      name: 'Gather 1',
      location: {
        googleId: '1',
        name: 'Gather 1',
        formattedAddress: 'Gather 1',
        lat: 1,
        lng: 1,
      },
      participants: [
        {
          id: '1',
          name: 'Participant 1',
        },
        {
          id: '2',
          name: 'New Participant',
        },
      ],
    };
  }
}
