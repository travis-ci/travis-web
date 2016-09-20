./config/deployment/store-pull-request-data.sh
export TRAVIS_PULL_REQUEST_BRANCH=`jq -r '.head.ref' pull-request.json | tr '.' '-'`
ember deploy org-production-pull-request --activate --verbose &
API_ENDPOINT=https://api-staging.travis-ci.org ember deploy org-staging-pull-request --activate --verbose &
TRAVIS_PRO=true ember deploy com-production-pull-request --activate --verbose
./config/deployment/update-github-status.sh
