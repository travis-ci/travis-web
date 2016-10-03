curl -X POST \
     --data "{\"state\": \"success\", \"target_url\": \"https://`echo $CLEANED_BRANCH_SUBDOMAIN`.test-deployments.travis-ci.org\", \"description\": \"Visit a org-production deployment for this commit\", \"context\": \"deployments/org-production\"}" \
     -H "Authorization: token $GITHUB_TOKEN" \
     https://api.github.com/repos/travis-ci/travis-web/statuses/$TRAVIS_PULL_REQUEST_SHA
curl -X POST \
     --data "{\"state\": \"success\", \"target_url\": \"https://`echo $CLEANED_BRANCH_SUBDOMAIN`.test-deployments.travis-ci.com\", \"description\": \"Visit a com-production deployment for this commit\", \"context\": \"deployments/com-production\"}" \
     -H "Authorization: token $GITHUB_TOKEN" \
     https://api.github.com/repos/travis-ci/travis-web/statuses/$TRAVIS_PULL_REQUEST_SHA

if [[ $TRAVIS_PULL_REQUEST_BRANCH = *staging* ]]
then
  curl -X POST \
      --data "{\"state\": \"success\", \"target_url\": \"https://`echo $CLEANED_BRANCH_SUBDOMAIN`-staging.test-deployments.travis-ci.org\", \"description\": \"Visit a org-staging deployment for this commit\", \"context\": \"deployments/org-staging\"}" \
      -H "Authorization: token $GITHUB_TOKEN" \
      https://api.github.com/repos/travis-ci/travis-web/statuses/$TRAVIS_PULL_REQUEST_SHA
  curl -X POST \
       --data "{\"state\": \"success\", \"target_url\": \"https://`echo $CLEANED_BRANCH_SUBDOMAIN`-staging.test-deployments.travis-ci.com\", \"description\": \"Visit a com-staging deployment for this commit\", \"context\": \"deployments/com-staging\"}" \
       -H "Authorization: token $GITHUB_TOKEN" \
       https://api.github.com/repos/travis-ci/travis-web/statuses/$TRAVIS_PULL_REQUEST_SHA
fi
