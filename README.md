## Travis CI ember web client
[![Build Status](https://travis-ci.org/travis-ci/travis-web.png?branch=master)](https://travis-ci.org/travis-ci/travis-web)
### Running the app

In order to run the app you need to install dependencies with:

    bundle install

Then you have to run the server, the easiest way to do this is to
use foreman:

    bundle exec foreman start

Now you can open [localhost:5000](http://localhost:5000)

By default it uses the official API at `https://api.travis-ci.org`, but you
can customize the API server URL using:


    API_ENDPOINT="http://localhost:300/" bundle exec foreman start

This will run against API run locally.

### Compiling assets manually

    bundle exec rakep
    ENV=production bundle exec rakep

### Running the spec suite

First, start the app (see above).

    bundle exec foreman start

To run the Ruby specs, run rspec against the spec/ directory:

    bundle exec rspec spec/

To run the Jasmine specs, open the spec page: [localhost:5000/spec.html](http://localhost:5000/spec.html)

### i18n

Localization for travis-web is managed via [localeapp](http://localeapp.com).
If you are interested in improving the existing localizations or adding
a new locale, please contact us on irc (#travis) and we will set you up.

Please do **not** edit the YAML files directly.

Localization data can be synced with the following rake task:

    bundle exec localeapp:update

This will publish any new keys in en.yml, as well as any missing keys
from your handlebars templates and pull down the latest localizations.

*note*: You will need to have the localeapp api key exported to
LOCALEAPP_API_KEY
