./config/deployment/store-pull-request-data.sh
export TRAVIS_PULL_REQUEST_BRANCH=`jq -r '.head.ref' pull-request.json | tr '.' '-'`
rm -rf /tmp
ember deploy org-production-pull-request --activate --verbose
ember deploy com-production-pull-request --activate --verbose
./config/deployment/update-github-status.sh
