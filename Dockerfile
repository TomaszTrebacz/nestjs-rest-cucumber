FROM node:14.17-alpine as build

WORKDIR /usr/src/app

COPY package.json package-lock.json tsconfig.json tsconfig.build.json nest-cli.json ./

RUN npm ci --no-progress

COPY src ./src

RUN npm run build


FROM node:14.17-alpine

ARG APP_VERSION
ENV APP_VERSION ${APP_VERSION}
ARG APP_BUILD_TIMESTAMP
ENV APP_BUILD_TIMESTAMP ${APP_BUILD_TIMESTAMP}

RUN apk add tini

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
COPY email-templates/*.html ./email-templates/

RUN npm ci --no-progress --production

COPY --from=build /usr/src/app/dist ./dist

ENTRYPOINT ["tini", "--"]

CMD ["node", "-r", "source-map-support/register", "dist/main"]
