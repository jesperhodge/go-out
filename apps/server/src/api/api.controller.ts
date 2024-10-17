import { UserJSON } from '@clerk/express'
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  RawBodyRequest,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { Request as ExpressRequest } from 'express'
import { Webhook } from 'svix'

interface ClerkWebhookEvent {
  type: string
  data: UserJSON
}

@Controller('api')
export class ApiController {
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

    // Do something with the payload
    // For this guide, you simply log the payload to the console
    const { id } = evt.data
    const eventType = evt.type
    console.log(`Webhook with an ID of ${id} and type of ${eventType}`)
    console.log('Webhook body:', evt.data)

    return {
      success: true,
      message: 'Webhook received',
    }
  }
}
