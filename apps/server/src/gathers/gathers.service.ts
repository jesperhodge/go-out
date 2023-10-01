import { Gather } from '@customTypes/gather';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class GathersService {
  private readonly gathers: Gather[] = [];

  create(gather: Gather): Gather {
    this.gathers.push(gather);
    return gather;
  }

  findAll(): Gather[] {
    return this.gathers;
  }

  findOne(id: string): Gather | undefined {
    return this.gathers.find((gather) => gather.id === id);
  }

  join(gatherId: string, userId: string): Gather {
    const gather = this.gathers.find((gather) => gather.id === gatherId);
    if (gather) {
      // TODO: Check if user is already in the gather and get the actual user name
      gather.participants.push({ id: userId, name: 'Participant 1' });
    }
    if (!gather) throw new NotFoundException();
    return gather;
  }
}
