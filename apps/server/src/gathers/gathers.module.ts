import { Module } from '@nestjs/common';
import { GathersController } from './gathers.controller';
import { GathersService } from './gathers.service';

@Module({
  controllers: [GathersController],
  providers: [GathersService],
})
export class GathersModule {}
