export CLEANED_BRANCH_SUBDOMAIN=ember-$EMBER_VERSION
export DISABLE_SENTRY=true

./config/deployment/store-redis-urls.sh

# This is a hack to get ember-try to set up a deployment of a prerelease Ember version.
ember try:one data-$EMBER_VERSION --skip-cleanup=true --- ls

ember deploy org-$EMBER_VERSION --activate
TRAVIS_PRO=true ember deploy com-$EMBER_VERSION --activate

# Now we deploy a prerelease Ember Data version.

export CLEANED_BRANCH_SUBDOMAIN=ember-data-$EMBER_VERSION

ember try:reset
ember try:one data-$EMBER_VERSION --skip-cleanup=true --- ls

ember deploy org-$EMBER_VERSION --activate
TRAVIS_PRO=true ember deploy com-$EMBER_VERSION --activate
