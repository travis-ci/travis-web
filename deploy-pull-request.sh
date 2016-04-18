curl -sH "Authorization: token $GITHUB_TOKEN" https://api.github.com/repos/travis-ci/travis-web/pulls/$TRAVIS_PULL_REQUEST
echo "commit:"
echo $TRAVIS_COMMIT
export TRAVIS_PULL_REQUEST_BRANCH=`curl -sH "Authorization: token $GITHUB_TOKEN" https://api.github.com/repos/travis-ci/travis-web/pulls/$TRAVIS_PULL_REQUEST | grep -A 2 "\"head\"" | grep ref | cut -d '"' -f4`
echo $TRAVIS_PULL_REQUEST_BRANCH

ember deploy pull-request --activate --verbose
./update-github-status.sh
