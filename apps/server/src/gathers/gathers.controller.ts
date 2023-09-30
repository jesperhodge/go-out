import { Controller, Get } from '@nestjs/common';

@Controller('gathers')
export class GathersController {
  @Get()
  findAll(): Promise<any[]> {
    return 'This action returns all gathers';
  }
}
