// export class CreateGatherDto {
//   gather: Omit<Gather, 'id'>
// }

export class CreateGatherDto {
  gather: GatherWithoutId
}
export class GatherWithoutId {
  name?: string
  date?: string
  gatherLocation: GatherLocation
  participants?: Participant[]
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

export class Participant {
  id?: string
  name: string
}

export class GatherLocation {
  googleId?: string
  location?: string
  name?: string
  formattedAddress?: string
}

export interface Gather {
  id?: string

  name?: string

  gatherLocation: GatherLocation

  participants: Participant[]
}
