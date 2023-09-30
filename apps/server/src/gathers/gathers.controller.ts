import { Controller, Get, Param, Post } from '@nestjs/common';
import { Gather } from '@customTypes/gather';

@Controller('gathers')
export class GathersController {
  @Get()
  findAll(): Promise<Gather[]> {
    return new Promise(() => [
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
    ]);
  }

  @Get(':id')
  findOne(@Param() params: { id: string }): Promise<Gather> {
    console.log(params.id);
    return new Promise(() => ({
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
    }));
  }

  @Post()
  create(): Promise<Gather> {
    return new Promise(() => ({
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
    }));
  }

  @Post(':id/join')
  join(@Param() params: { id: string }): Promise<Gather> {
    console.log(params.id);
    return new Promise(() => ({
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
    }));
  }
}
