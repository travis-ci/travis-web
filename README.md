## Travis CI ember web client

[![Build Status](https://travis-ci.org/travis-ci/travis-web.svg?branch=master)](https://travis-ci.org/travis-ci/travis-web)
### Running the app

The app is developed using [Ember CLI](http://ember-cli.com). It requires nodejs
with npm installed.

In order to run the app you need to install dependencies with:

    npm install

And then install ember-cli globally in order to have access to the `ember` command:

    npm install -g ember-cli

Now you can run the server:

    ember serve

And open http://localhost:4200 in the browser.

Alternatively you can run `ember build --watch` and start the server with `waiter/script/server`

### Waiter Workarounds

Should you encounter issues installing Puma while bundling Waiter on a recent
OSX version, you need to tinker with Homebrew:

``` bash
brew install openssl
brew link --force openssl
```

You should then be able to run `bundle install` as usual.

### Running the app in private repos mode

At the moment Travis CI is available as two separate sites - https://travis-ci.org for Open Source
projects and https://travis-ci.com for private projects. travis-web will connect
to the Open Source version by default. In order to connect it to the API for private projects
you need to run:

```
TRAVIS_PRO=true ember serve --ssl --ssl-key=ssl/server.key --ssl-cert=ssl/server.crt
```

One caveat here is that the command will start server with SSL, so the page will
be accessible at https://localhost:4200 (note `https` part).

### Running on SSL in general

Sometimes there is a need to test the app with an SSL connection. This is required
to make Pusher work when running Travis CI Pro, but it may also be needed in other
situations.

There's already an SSL certificate in the `ssl` directory, which is set for `localhost`
host. If you want to use it, you can start the server with:

```
ember serve --ssl --ssl-key=ssl/server.key --ssl-cert=ssl/server.crt
```

In case you want your own certificate, you can follow the instructions posted
here: https://gist.github.com/trcarden/3295935 and then point the server to your
certificate with `--ssl-key` and `--ssl-cert`.

### Running tests

To run the test suite execute:

    ember test

You can also start an interactive test runner for easier development:

    ember test --serve

### Feature Flags

`travis-web` is beginning the transition to use feature flags wherever it makes
sense. To enable/disable/add/remove a feature flag for the application, you can
edit the `config/environment.js` file. For instance, to enable `some-feature`, you would
simply add/update the file like so:

```js
  {
    featureFlags: {
      'some-feature': true
    }
  }
```

This uses the awesome [ember-feature-flags](https://github.com/kategengler/ember-feature-flags) addon under the hood, so be sure to read its own
documentation for more information.

### Debugging

Ember's default logging has been disabled in all environments by default and
moved to a feature flag. To enable it, simply edit the `debug-logging` feature
flag as mentioned previously in the `Feature Flags` section.

### Deploying

`ember-cli-deploy` is available for deploying pull requests. See `after_success`
in `.travis.yaml` and associated scripts for details. It uses the “lightning
strategy” of deploying assets to S3 and `index.html` to a Redis server. You can
deploy from your own machine too:

```
AWS_KEY=key AWS_SECRET=secret ORG_PRODUCTION_REDIS_URL=redis TRAVIS_PULL_REQUEST_BRANCH=branch \
ember deploy org-production-pull-request --activate
```

After success, your deployment will be available at branch.test-deployments.travis-ci.org.

See [the documentation](https://github.com/travis-pro/manual/pull/13) for the full list of
deployment environments and more details.

The Redis server is a modified version of `waiter/lib/travis/web/app.rb`. We will eventually replace
that with [`travis-web-index`](https://github.com/travis-ci/travis-web-index) and move to using
`ember-cli-deploy` for all deployments.

### Ember beta and canary deployments

Upon a merge to `master`, the application is built with the latest beta and canary versions
of Ember, running against the production API. This uses the same infrastructure as the
pull request deployments. You can visit these deployments at:
* https://ember-beta.travis-ci.org
* https://ember-beta.travis-ci.com
* https://ember-canary.travis-ci.org
* https://ember-canary.travis-ci.com

These deployments are also performed with the weekly cron build.
