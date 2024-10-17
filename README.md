# README

## Description

This is a hobby project in early development which is basically a prototype for an app that's a bit similar to meetup, but built for more spontaneous get-togethers. Have you ever been bored on a Friday evening, your friends don't have time or you don't know people yet as you just moved to a new town? Don't worry, now you can use **Go Out** to check who's visiting your favorite bars in town. No events? Just create one spontaneously and see who hops on. With Go Out, you can join up spontaneously with like-minded people you don't know yet and make new friends.

Q: Isn't this the same thing as meetup?
A: The features have a lot of overlap, but it should be a very different experience for users. With meetup, you have groups with people that meet regularly, the meetings need to be planned and organized, and you need to get enough members together to be visible and gain interest. The idea here is more that it's used for when you're like "boy, I'm going for a run in the city park later and wish I could have some company. And I'd love to meet some new people!" - so you just create an event and an hour later you're on the way to the park and see someone has joined the event. Next thing you know, you made a good friend.

## Design decisions

- This is a monorepo that uses a pnpm workspace.
- Google Maps is the solution for the prototype right now. I explored some other, cheaper solution including Bing maps, but it turned out to be very hard to collect the place data for local businesses or search results and integrate it with the autocomplete. If this turns into a small product, the solutions are either to monetize it sufficiently to afford google maps or to switch to another solution (Bing maps is still not out of the question, just entails a lot of effort.)
- The frontend is in Next.js and the backend in Nest.js
- Database is postgres, provided via docker compose
- I started out with a mock server on the basis of a swagger.yaml that's still lying around and started in the docker compose, but it's not very helpful at this point and I'll probably remove it.

## Requirements
- Google Maps API key
- node >= 16
- pnpm
- docker

## Get started
- `cp .env.example .env`
- add your Google Maps API key to .env
- `pnpm install`
- `pnpm dev` (runs "docker compose up" and local servers)
- setup your postgres db and add database url to env variables
- log in to database via `localhost:8080` just by selecting Postgres and
your user and password, don't fill in the "Database" field
(just use admin/admin)
- `cd apps/server` and `pnpx prisma migrate reset`
- navigate to `localhost:3000`. You may need to refresh one or multiple times until you see google maps load; needs debugging.
- In order to sync user creation between the external identity provider, clerk, you need to follow steps 1-3 of the instructions at https://clerk.com/docs/integrations/webhooks/sync-data. The default port for this backend for ngrok to forward to is 4000. The url to configure for the clerk webhook is `<ngrok-url>/api/webhooks/createuser`.