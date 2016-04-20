export TRAVIS_PULL_REQUEST_COMMIT=`jq -r '.head.sha' pull-request.json`
curl -X POST \
     --data "{\"state\": \"success\", \"target_url\": \"https://`echo $TRAVIS_PULL_REQUEST_BRANCH`.test-deployments.travis-ci.org\", \"description\": \"Visit a deployment for this commit\", \"context\": \"deployment\"}" \
     -H "Authorization: token $GITHUB_TOKEN" \
     https://api.github.com/repos/travis-ci/travis-web/statuses/$TRAVIS_PULL_REQUEST_COMMIT
