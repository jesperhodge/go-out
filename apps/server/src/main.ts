import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { NestExpressApplication } from '@nestjs/platform-express/interfaces'
import { ValidationPipe } from '@nestjs/common'
import { clerkMiddleware } from '@clerk/express'

function printRoutes(
  app: NestExpressApplication<
    import('node:http').Server<typeof import('node:http').IncomingMessage, typeof import('node:http').ServerResponse>
  >,
) {
  const server: any = app.getHttpServer()
  const router = server._events.request._router

  const availableRoutes: [] = router.stack
    .map((layer: any) => {
      if (layer.route) {
        return {
          route: {
            path: layer.route?.path,
            method: layer.route?.stack[0].method,
          },
        }
      }
    })
    .filter((item: any) => item !== undefined)
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  app.enableCors({ origin: '*' })
  app.use(clerkMiddleware())
  app.useGlobalPipes(new ValidationPipe({ transform: true }))

  await app.listen(process.env.PORT || 4000)

  printRoutes(app)
}
bootstrap()
