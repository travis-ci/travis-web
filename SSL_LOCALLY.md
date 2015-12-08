Sometimes there is a need to test the app with an SSL connection, for example for
testing pusher on Travis CI Pro.

In order to run the app with SSL enabled you need to:

* generate self signed certificate as described here: https://gist.github.com/trcarden/3295935
  * one difference is that you need to use localhost.ssl, because travis-api
    doesn't whitelist localhost.ssl at the moment
* run Ember app with ssl options: `TRAVIS_PRO=true ember serve --ssl --ssl-key=ssl/server.key --ssl-cert=ssl/server.crt`
