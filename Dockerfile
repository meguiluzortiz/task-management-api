FROM node:12.18-alpine AS development
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn --frozen-lockfile
COPY . .

FROM node:12.18-alpine AS build
RUN apk update && apk add yarn curl bash && rm -rf /var/cache/apk/*
RUN curl -sfL https://install.goreleaser.com/github.com/tj/node-prune.sh | bash -s -- -b /usr/local/bin
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn --frozen-lockfile
COPY . .
RUN yarn lint & yarn test
RUN yarn build
RUN npm prune --production
RUN /usr/local/bin/node-prune

FROM node:12.18-alpine AS production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/config ./config
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
CMD ["node", "dist/main"]
