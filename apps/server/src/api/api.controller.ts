import { Controller, Get } from '@nestjs/common'

@Controller('api')
export class ApiController {
  @Get('webhooks/createUser')
  async createUser() {
    console.log('created user!')
  }
}
