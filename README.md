## Travis CI ember web client

### Running the app

This is a static html/js app so you shouldn't need to install anything.

    git clone git://github.com/travis-ci/travis-web.git
    cd travis-web
    open public/index.html

Running against existing API endpoint:

    API_ENDPOINT="https://api.travis-ci.org/" RUN_API=0 bundle exec rackup

Run locally, one on `ci.dev` and one on `api.dev`:

    . dev.env
    bundle exec rackup

### Compiling assets manually

    bundle exec rakep
    ENV=production bundle exec rakep

### Compiling assets on change

    bundle exec guard
