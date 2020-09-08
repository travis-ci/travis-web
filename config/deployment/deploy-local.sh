#!/bin/bash

export CLEANED_BRANCH_SUBDOMAIN=`git name-rev --name-only HEAD | tr '.' '-' | tr '/' '-' | tr '[:upper:]' '[:lower:]'`

if [[ $TRAVIS_PULL_REQUEST_BRANCH = *staging* ]]
then
  echo "Staging branch is not allowed to be deployed locally"
  exit 1
fi

ember deploy org-production-pull-request --activate
TRAVIS_PRO=true ember deploy com-production-pull-request --activate

echo "Deployment URLs:"
echo "- https://$CLEANED_BRANCH_SUBDOMAIN.test-deployments.travis-ci.org"
echo "- https://$CLEANED_BRANCH_SUBDOMAIN.test-deployments.travis-ci.com"
