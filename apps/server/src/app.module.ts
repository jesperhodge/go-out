import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { GathersModule } from './gathers/gathers.module'
import { ConfigModule } from '@nestjs/config'
import { UsersModule } from './users/users.module'
import { PrismaService } from './prisma.service'

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), GathersModule, UsersModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
