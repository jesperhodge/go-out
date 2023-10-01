import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GathersModule } from './gathers/gathers.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), GathersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
