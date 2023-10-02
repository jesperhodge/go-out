import { Gather } from '@customTypes/gather'

export class CreateGatherDto {
  gather: Omit<Gather, 'id'>
}

export class JoinGatherDto {
  gatherId: number
  userId: number
}

export class ListAllEntities {
  id?: number
  name?: string
  limit?: number
  location?: string
  date?: string
  googleId?: string
  address?: string
  googlePlaceName?: string
  // participantId?: string
}
