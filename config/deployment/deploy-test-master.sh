export CLEANED_BRANCH_SUBDOMAIN=ember-$EMBER_VERSION

ember deploy org-$EMBER_VERSION --activate --verbose
TRAVIS_PRO=true ember deploy com-$EMBER_VERSION --activate --verbose
