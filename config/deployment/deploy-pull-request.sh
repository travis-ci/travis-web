curl -sH "Authorization: token $GITHUB_TOKEN" https://api.github.com/repos/travis-ci/travis-web/pulls/$TRAVIS_PULL_REQUEST > pull-request.json
echo "commit:"
echo $TRAVIS_COMMIT
export TRAVIS_PULL_REQUEST_BRANCH=`jq -r '.head.ref' pull-request.json`
echo $TRAVIS_PULL_REQUEST_BRANCH

ember deploy pull-request --activate --verbose
./config/deployment/update-github-status.sh
