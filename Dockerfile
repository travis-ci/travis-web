FROM ruby:2.7.5 as build

LABEL maintainer Travis CI GmbH <support+travis-web-docker-images@travis-ci.com>

ENV NPM_CONFIG_LOGLEVEL info
ENV NODE_VERSION 10.7.0
ENV YARN_VERSION 0.22.0

RUN ( \
  groupadd --gid 1000 node \
  && useradd --uid 1000 --gid node --shell /bin/bash --create-home node; \
  curl -SLO "https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.xz" \
  && tar -xJf "node-v$NODE_VERSION-linux-x64.tar.xz" -C /usr/local --strip-components=1 \
  && ln -s /usr/local/bin/node /usr/local/bin/nodejs; \
  curl -fSL -o yarn.js "https://yarnpkg.com/downloads/$YARN_VERSION/yarn-legacy-$YARN_VERSION.js" \
  && mv yarn.js /usr/local/bin/yarn \
  && chmod +x /usr/local/bin/yarn; \
  mkdir -p /app; \
)
COPY package.json /app
COPY package-lock.json /app
COPY . /app

WORKDIR /app

RUN (\
  npm install --silent -g ember-cli; \
  npm ci; \
  ember build --environment=production; \
  ls -l /app; \
  ls -l /app/dist; \
)

FROM ruby:2.7.5-slim

LABEL maintainer Travis CI GmbH <support+travis-web-docker-images@travis-ci.com>

RUN ( \
  gem install bundler:2.3.7; \
  bundle config --global frozen 1; \
  mkdir -p /app/dist; \
)

WORKDIR /app

COPY --from=build /app/dist/ /app/dist/
COPY Gemfile* /app/
COPY waiter /app/waiter
COPY public /app/public
COPY ssl    /app/ssl

RUN (\

  cp -a public/* dist/; \
  rm -rf public; \
  apt-get update ; \
  apt-get upgrade -y ; \
  apt-get install -y --no-install-recommends git make gcc g++ libpq-dev libjemalloc-dev; \
  rm -rf /var/lib/apt/lists/*; \
  bundle install --without assets development test; \
  sed -i "/stripe.com\/v3/d" /app/dist/index.html; \
  apt-get remove -y gcc g++ make git perl && apt-get -y autoremove; \
)


CMD ["bundle", "exec", "puma", "-I", "lib", "-p", "${PORT:-4000}", "-t", "${PUMA_MIN_THREADS:-8}:${PUMA_MAX_THREADS:-12}", "-w", "${PUMA_WORKERS:-2}", "--preload", "waiter/config.ru" ]
