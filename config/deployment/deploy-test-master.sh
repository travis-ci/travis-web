export CLEANED_BRANCH_SUBDOMAIN=ember-$EMBER_VERSION
export DISABLE_SENTRY=true

./config/deployment/store-redis-urls.sh

ember deploy org-$EMBER_VERSION --activate
TRAVIS_PRO=true ember deploy com-$EMBER_VERSION --activate

# This all seems very hackish but it’ll do for now.

export CLEANED_BRANCH_SUBDOMAIN=ember-data-$EMBER_VERSION

# Restore from the previous ember-try command
git reset --hard HEAD
npm install && bower install

ember try:one data-$EMBER_VERSION --skip-cleanup=true --- ls

ember deploy org-$EMBER_VERSION --activate
TRAVIS_PRO=true ember deploy com-$EMBER_VERSION --activate
