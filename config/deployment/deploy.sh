export ORG_STAGING_REDIS_URL=`heroku config:get REDIS_URL -a travis-web-staging`
export CLEANED_BRANCH_SUBDOMAIN=`echo $TRAVIS_BRANCH | tr '.' '-' | tr '[:upper:]' '[:lower:]'`


ember deploy org-staging