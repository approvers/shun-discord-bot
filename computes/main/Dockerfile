FROM node:12-alpine AS build
WORKDIR /build
RUN mkdir -p computes/main

COPY ./package.json /build
COPY ./yarn.lock /build
COPY ./computes/main/package.json /build/computes/main
RUN yarn install

COPY . /build
RUN yarn workspace main build


FROM node:12-alpine
WORKDIR /app

ENV NODE_ENV=production
ENV GOOGLE_APPLICATION_CREDENTIALS=/app/token.json

COPY --from=build /build/computes/main/package.json /app
COPY --from=build /build/yarn.lock /app
RUN yarn install && yarn cache clean

COPY --from=build /build/token.json /app
COPY --from=build /build/computes/main/usage.yml /app
COPY --from=build /build/computes/main/dist /app/dist

CMD ["yarn", "start"]
