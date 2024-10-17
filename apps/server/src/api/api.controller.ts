import { EmailAddressJSON, UserJSON } from '@clerk/express'
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  RawBodyRequest,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { UsersService } from '@server/users/users.service'
import { Request as ExpressRequest } from 'express'
import { Webhook } from 'svix'

const USER_CREATED_EVENT_TYPE = 'user.created'

interface ClerkWebhookEvent {
  type: string
  data: UserJSON
}

@Controller('api')
export class ApiController {
  constructor(private readonly usersService: UsersService) {}

  @Post('webhooks/createuser')
  async createUser(@Req() req: RawBodyRequest<ExpressRequest>) {
    // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET
    if (!WEBHOOK_SECRET) {
      throw new Error('You need a WEBHOOK_SECRET in your .env')
    }

    // Get the headers and body
    const headers = req.headers
    const payload = req.rawBody
    if (payload === undefined) {
      throw new BadRequestException('Bad request body')
    }

    // Get the Svix headers for verification
    const svix_id = headers['svix-id'] as string | undefined
    const svix_timestamp = headers['svix-timestamp'] as string | undefined
    const svix_signature = headers['svix-signature'] as string | undefined

    // If there are no Svix headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new Response('Error occured -- no svix headers', {
        status: 400,
      })
    }

    // Create a new Svix instance with your secret.
    const wh = new Webhook(WEBHOOK_SECRET)

    let evt: ClerkWebhookEvent

    // Attempt to verify the incoming webhook
    // If successful, the payload will be available from 'evt'
    // If the verification fails, error out and  return error code
    console.log('payload: ', payload)
    console.log('svix_id', svix_id)
    try {
      evt = wh.verify(payload, {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      }) as ClerkWebhookEvent
    } catch (err) {
      console.log('err: ', err)
      throw new BadRequestException('Error verifying webhook', { cause: err })
    }

    if (evt.type !== USER_CREATED_EVENT_TYPE) {
      throw new BadRequestException(`expected event type "${USER_CREATED_EVENT_TYPE}"`)
    }

    const { first_name, last_name, id, image_url, email_addresses, primary_email_address_id }: UserJSON = evt.data
    const email: string | undefined = email_addresses.find(
      (email: EmailAddressJSON) => email?.id === primary_email_address_id,
    )?.email_address

    if (!email) {
      throw new BadRequestException(`missing primary email address`)
    }

    const createUserDto = {
      name: `${first_name} ${last_name}`,
      clerkUuid: id,
      email,
    }

    if (await this.usersService.createUser(createUserDto)) {
      return {
        success: true,
        message: 'Webhook received and user created',
      }
    } else {
      throw new InternalServerErrorException('Webhook received, but encountered error when attempting to create user')
    }
  }
}
