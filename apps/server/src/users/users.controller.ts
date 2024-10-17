import { Controller, Param, Post } from '@nestjs/common'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post(':clerkUuid')
  async createUser(@Param() params: { clerkUuid: string }): Promise<void> {
    this.usersService.createUser(params.clerkUuid)
  }
}
