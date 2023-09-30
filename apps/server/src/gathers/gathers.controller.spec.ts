import { Test, TestingModule } from '@nestjs/testing';
import { GathersController } from './gathers.controller';

describe('GathersController', () => {
  let controller: GathersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GathersController],
    }).compile();

    controller = module.get<GathersController>(GathersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
