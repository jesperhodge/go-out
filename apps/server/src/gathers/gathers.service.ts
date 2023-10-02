import { Injectable } from '@nestjs/common'
import { PrismaService } from '@server/prisma.service'
import { Gather, Prisma } from '@prisma/client'
import { CreateGatherDto, ListAllEntities } from './dto/gathers.dto'

const CURRENT_USER_PLACEHOLDER_ID = 1

@Injectable()
export class GathersService {
  constructor(private prisma: PrismaService) {}

  async create(gatherDto: CreateGatherDto): Promise<Gather> {
    const data = {
      ...gatherDto.gather,
      participants: {
        connect: [{ id: CURRENT_USER_PLACEHOLDER_ID }],
      },
      creator: {
        connect: { id: CURRENT_USER_PLACEHOLDER_ID },
      },
      googlePlace: {
        connectOrCreate: {
          where: {
            place_id: gatherDto.gather.location.googleId,
          },
          create: {
            place_id: gatherDto.gather.location.googleId,
            name: gatherDto.gather.location.name,
            formatted_address: gatherDto.gather.location.formattedAddress,
            lat: gatherDto.gather.location.lat,
            lng: gatherDto.gather.location.lng,
          },
        },
      },
    }
    return this.prisma.gather.create({ data })
  }

  async findAll(query: ListAllEntities): Promise<Gather[]> {
    const where: Prisma.GatherWhereInput = {
      id: query.id,
      name: query.name,
      date: query.date ? new Date(query.date) : undefined,
      googlePlaceId: query.googleId,
      googlePlace: {
        is: {
          lat: query.lat,
          lng: query.lng,
          name: query.googlePlaceName,
          formatted_address: query.address,
        },
      },
    }

    return this.prisma.gather.findMany({
      where,
      include: {
        participants: true,
        creator: true,
        googlePlace: true,
      },
    })
  }

  async findOne(id: number): Promise<Gather | null> {
    return this.prisma.gather.findUnique({
      where: {
        id: id,
      },
      include: {
        participants: true,
        creator: true,
        googlePlace: true,
      },
    })
  }

  // TODO: verify that user id corresponds to logged in user
  async join(gatherId: number, userId: number): Promise<Gather> {
    const result = await this.prisma.gather.update({
      where: { id: gatherId },
      data: {
        participants: {
          connect: {
            id: userId,
          },
        },
      },
      include: {
        participants: true,
        creator: true,
        googlePlace: true,
      },
    })
    return result
  }
}
