export CLEANED_BRANCH_SUBDOMAIN=ember-$EMBER_VERSION
export DISABLE_SENTRY=true

./config/deployment/store-redis-urls.sh

ember deploy org-$EMBER_VERSION --activate
TRAVIS_PRO=true ember deploy com-$EMBER_VERSION --activate
