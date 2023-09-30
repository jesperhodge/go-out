import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GathersModule } from './gathers/gathers.module';

@Module({
  imports: [GathersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
