FROM ruby:3.2.2

LABEL maintainer Travis CI GmbH <support+travis-web-docker-images@travis-ci.com>

RUN groupadd --gid 1000 node \
  && useradd --uid 1000 --gid node --shell /bin/bash --create-home node

ENV NPM_CONFIG_LOGLEVEL info
ENV NODE_VERSION 18.19.0

RUN curl -SLO "https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.xz" \
  && tar -xJf "node-v$NODE_VERSION-linux-x64.tar.xz" -C /usr/local --strip-components=1 \
  && ln -s /usr/local/bin/node /usr/local/bin/nodejs

ENV YARN_VERSION 0.22.0

RUN curl -fSL -o yarn.js "https://yarnpkg.com/downloads/$YARN_VERSION/yarn-legacy-$YARN_VERSION.js" \
  && mv yarn.js /usr/local/bin/yarn \
  && chmod +x /usr/local/bin/yarn

# throw errors if Gemfile has been modified since Gemfile.lock
RUN bundle config --global frozen 1

RUN mkdir -p /app
WORKDIR /app

COPY Gemfile      /app
COPY Gemfile.lock /app
COPY waiter       /app/waiter

RUN bundle install --without assets development test

COPY package.json /app
COPY package-lock.json /app

RUN npm install --silent -g ember-cli

COPY . /app

RUN --mount=type=secret,id=GITHUB_PERSONAL_TOKEN export GITHUB_PERSONAL_TOKEN=$(cat /run/secrets/GITHUB_PERSONAL_TOKEN) && git config --global url."https://$GITHUB_PERSONAL_TOKEN@github.com/".insteadOf ssh://git@github.com

RUN npm ci

COPY build.sh .
RUN chmod +x build.sh
RUN --mount=type=secret,id=AIDA_URL export AIDA_URL=$(cat /run/secrets/AIDA_URL) && ./build.sh

RUN cp -a public/* dist/

CMD bundle exec puma -I lib -p ${PORT:-4000} -t ${PUMA_MIN_THREADS:-8}:${PUMA_MAX_THREADS:-12} -w ${PUMA_WORKERS:-2} --preload waiter/config.ru
