FROM quay.io/travisci/travis-web-base

LABEL maintainer Travis CI GmbH <support+travis-build-docker-image@travis-ci.com>

# throw errors if Gemfile has been modified since Gemfile.lock
RUN bundle config --global frozen 1

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY Gemfile      /usr/src/app
COPY Gemfile.lock /usr/src/app
COPY waiter       /usr/src/app/waiter

RUN bundle install

COPY package.json /usr/src/app
COPY bower.json   /usr/src/app

RUN npm install -g bower

RUN npm install --quiet
RUN bower install --allow-root

COPY . /usr/src/app

CMD bundle exec rackup -s puma -p ${PORT:-4000} waiter/config.ru
