FROM oven/bun:latest AS base
WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y \
    curl \
    gnupg2 \
    lsb-release \
    ca-certificates \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean

FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json /temp/dev
RUN cd /temp/dev && bun install --frozen-lockfile

RUN mkdir -p /temp/prod
COPY package.json /temp/prod
RUN cd /temp/prod && bun install --frozen-lockfile --production

FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

RUN bun run build

FROM nginx:alpine
COPY --from=prerelease /usr/src/app/dist/bookstore-frontend/browser /usr/share/nginx/html/
COPY --from=install /temp/prod/node_modules node_modules
COPY nginx.conf /etc/nginx/conf.d/default.conf