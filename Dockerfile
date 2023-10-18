# node image
FROM node:18-alpine AS base

RUN npm i -g pnpm 

ENV NODE_ENV production

# install dependencies
FROM base AS deps

WORKDIR /web
ADD package.json pnpm-lock.yaml  ./
RUN pnpm install  --production=false

# build
FROM base AS build

WORKDIR /web
COPY --from=deps /web/node_modules /web/node_modules

ADD . .
RUN pnpm build
RUN pnpm prune --prod


# deploy
FROM base

WORKDIR /web

COPY --from=build /web ./

CMD [ "pnpm", "start" ] 
