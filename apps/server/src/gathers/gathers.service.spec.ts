import { Test, TestingModule } from '@nestjs/testing';
import { GathersService } from './gathers.service';

describe('GathersService', () => {
  let service: GathersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GathersService],
    }).compile();

    service = module.get<GathersService>(GathersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
