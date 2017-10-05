echo env = $ENVIRONMENT and tld = $TLD

if [[ "$ENVIRONMENT" = "staging" ]]
then
  SUFFIX="-staging"
else
  SUFFIX=""
fi

FULL_ENVIRONMENT=`echo $TLD`-`echo $ENVIRONMENT`
FULL_URL=https://`echo $CLEANED_BRANCH_SUBDOMAIN``echo $SUFFIX`.test-deployments.travis-ci.`echo $TLD`

echo deployment url: $FULL_URL

if [[ $DEPLOYMENT_EXIT_CODE ]]
then
  curl -X POST \
       --data "{\"state\": \"error\", \"description\": \"There was a failure with the PR deployment 😢\", \"context\": \"deployments/$FULL_ENVIRONMENT\"}" \
       -H "Authorization: token $GITHUB_TOKEN" \
       https://api.github.com/repos/travis-ci/travis-web/statuses/$TRAVIS_PULL_REQUEST_SHA
else
  curl -X POST \
       --data "{\"state\": \"success\", \"target_url\": \"$FULL_URL\", \"description\": \"Visit a $FULL_ENVIRONMENT deployment for this commit\", \"context\": \"deployments/$FULL_ENVIRONMENT\"}" \
       -H "Authorization: token $GITHUB_TOKEN" \
       https://api.github.com/repos/travis-ci/travis-web/statuses/$TRAVIS_PULL_REQUEST_SHA
fi
