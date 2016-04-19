echo "trying to curl with this:"
echo $TRAVIS_PULL_REQUEST_BRANCH
export TRAVIS_PULL_REQUEST_COMMIT=`curl -sH "Authorization: token $GITHUB_TOKEN" https://api.github.com/repos/travis-ci/travis-web/pulls/$TRAVIS_PULL_REQUEST | grep -A 3 "\"head\"" | grep sha | cut -d '"' -f4`

curl -X POST --data "{\"state\": \"success\", \"target_url\": \"https://`echo $TRAVIS_PULL_REQUEST_BRANCH`.test-deployments.travis-ci.org\", \"description\": \"Visit a deployment for this commit\", \"context\": \"deployment\"}" -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/repos/travis-ci/travis-web/statuses/$TRAVIS_PULL_REQUEST_COMMIT
