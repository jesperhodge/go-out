// export class CreateGatherDto {
//   gather: Omit<Gather, 'id'>
// }

import { IsNotEmpty } from 'class-validator'

export class CreateGatherDto {
  gather: GatherWithoutId
}
export class GatherWithoutId {
  name?: string
  date?: string
  googlePlace: GatherLocation
  participants?: Participant[]
  description?: string
  pictures?: string[]
}

export class JoinGatherDto {
  @IsNotEmpty()
  gatherId: number
}

export class ListAllEntitiesDto {
  id?: number
  name?: string
  limit?: number
  location?: string
  date?: string
  googleId?: string
  address?: string
  googlePlaceName?: string

  bounds?: string
  // participantId?: string
}

export class Participant {
  id?: string
  name: string
}

export class GatherLocation {
  googleId?: string
  location?: string
  name?: string
  formatted_address?: string
  lat?: number
  lng?: number
}

export interface Gather {
  id?: string
  name?: string
  googlePlace: GatherLocation
  participants: Participant[]
  description?: string
  pictures?: string[]
}
