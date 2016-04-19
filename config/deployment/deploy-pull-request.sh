curl -sH "Authorization: token $GITHUB_TOKEN" https://api.github.com/repos/travis-ci/travis-web/pulls/$TRAVIS_PULL_REQUEST > pull-request.json
export TRAVIS_PULL_REQUEST_BRANCH=`jq -r '.head.ref' pull-request.json | tr '.' '-'`
ember deploy pull-request --activate --verbose
./config/deployment/update-github-status.sh
