import { Gather } from '@customTypes/gather';

export class CreateGatherDto {
  gather: Gather;
}

export class JoinGatherDto {
  gatherId: string;
  userId: string;
}

export class ListAllEntities {
  id?: string;
  name?: string;
  limit?: number;
  lat?: number;
  lng?: number;
  radius?: number;
  googleId?: string;
  address?: string;
  googlePlaceName?: string;
  participantId?: string;
}
