import { Module } from '@nestjs/common'
import { GathersController } from './gathers.controller'
import { GathersService } from './gathers.service'
import { PrismaService } from '~/prisma.service'

@Module({
  controllers: [GathersController],
  providers: [GathersService, PrismaService],
})
export class GathersModule {}
