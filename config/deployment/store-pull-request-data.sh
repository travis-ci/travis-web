curl -sH "Authorization: token $GITHUB_TOKEN" https://api.github.com/repos/travis-ci/travis-web/pulls/$TRAVIS_PULL_REQUEST > pull-request.json
