import { IsEmail, IsOptional, IsString } from 'class-validator'

export class CreateUserDto {
  @IsString()
  clerkUuid: string

  @IsEmail()
  email: string

  @IsOptional()
  @IsString()
  name?: string
}
