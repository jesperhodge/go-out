import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { GathersModule } from './gathers/gathers.module'
import { ConfigModule } from '@nestjs/config'
import { UsersModule } from './users/users.module'
import { PrismaService } from './prisma.service'
import { DevToolsModule } from '@nestjs/devtools-integration'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GathersModule,
    UsersModule,
    DevToolsModule.register({ http: process.env.NODE_ENV !== 'production' }),
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
