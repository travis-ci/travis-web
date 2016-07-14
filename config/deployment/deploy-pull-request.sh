./config/deployment/store-pull-request-data.sh
export TRAVIS_PULL_REQUEST_BRANCH=`jq -r '.head.ref' pull-request.json | tr '.' '-'`
DEPLOY_TARGET=org-production-pull-request ember deploy org-production-pull-request --activate --verbose
DEPLOY_TARGET=com-production-pull-request ember deploy com-production-pull-request --activate --verbose
./config/deployment/update-github-status.sh
