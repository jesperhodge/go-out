import { Controller, Get, Post } from '@nestjs/common'

@Controller('api')
export class ApiController {
  @Post('webhooks/createuser')
  async createUser() {
    console.log('created user!')
  }
}
