import { Injectable } from '@nestjs/common'
import { PrismaService } from '@server/prisma.service'
import { Gather, Prisma } from '@prisma/client'
import { CreateGatherDto, ListAllEntitiesDto } from './dto/gathers.dto'

const CURRENT_USER_PLACEHOLDER_ID = 1

@Injectable()
export class GathersService {
  constructor(private prisma: PrismaService) {}

  async create(gatherDto: CreateGatherDto): Promise<Gather> {
    // extract lat and lng from location string "(lat, lng)".
    // For example, "(37.422, -122.084)" => [37.422, -122.084]
    const location = gatherDto.gather.googlePlace.location
    const lat: number | undefined = location ? parseFloat(location.split(',')[0].slice(1)) : undefined
    const lng: number | undefined = location ? parseFloat(location.split(',')[1].slice(0, -1)) : undefined

    const data = {
      name: gatherDto.gather.name || 'Placeholder',
      date: gatherDto.gather.date && new Date(gatherDto.gather.date),
      description: gatherDto.gather.description,
      pictures: gatherDto.gather.pictures || [],
      participants: {
        connect: [{ id: CURRENT_USER_PLACEHOLDER_ID }],
      },
      creator: {
        connect: { id: CURRENT_USER_PLACEHOLDER_ID },
      },
      googlePlace: {
        connectOrCreate: {
          where: {
            place_id: gatherDto.gather.googlePlace.googleId,
            location: gatherDto.gather.googlePlace.location,
          },
          create: {
            place_id: gatherDto.gather.googlePlace.googleId,
            name: gatherDto.gather.googlePlace.name || 'Placeholder',
            formatted_address: gatherDto.gather.googlePlace.formatted_address,
            location: gatherDto.gather.googlePlace.location,
            lat,
            lng,
          },
        },
      },
    }
    return this.prisma.gather.create({
      data,
      include: {
        participants: true,
        creator: true,
        googlePlace: true,
      },
    })
  }

  async findAll(query: ListAllEntitiesDto): Promise<Gather[]> {
    const bounds = query.bounds ? JSON.parse(query.bounds as unknown as string) : undefined

    const googleLocationBoundsQuery = bounds
      ? {
          lat: {
            gte: bounds.south,
            lte: bounds.north,
          },
          lng: {
            gte: bounds.west,
            lte: bounds.east,
          },
        }
      : undefined

    const googleLocationFindOneQuery =
      query.location || query.googlePlaceName || query.address
        ? {
            OR: [{ location: query.location }, { name: query.googlePlaceName }, { formatted_address: query.address }],
          }
        : undefined

    const googleLocationFilter: Prisma.GooglePlaceWhereInput =
      googleLocationBoundsQuery || googleLocationFindOneQuery || {}

    const searchFilter: Prisma.GatherWhereInput = {
      id: query.id,
      name: query.name,
      date: query.date ? new Date(query.date) : undefined,
      googlePlaceId: query.googleId,
      googlePlace: googleLocationFilter,
    }

    const limit = query.limit ? parseInt(query.limit as unknown as string) : 100

    const res = await this.prisma.gather.findMany({
      where: searchFilter,
      take: limit,
      include: {
        participants: true,
        creator: true,
        googlePlace: true,
      },
    })

    return res
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
