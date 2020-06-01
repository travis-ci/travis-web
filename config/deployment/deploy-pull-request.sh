export CLEANED_BRANCH_SUBDOMAIN=`echo $TRAVIS_PULL_REQUEST_BRANCH | tr '.' '-' | tr '/' '-' | tr '[:upper:]' '[:lower:]'`

if [[ $TRAVIS_PULL_REQUEST_BRANCH = *staging* ]]
then
  API_ENDPOINT=https://api-staging.travis-ci.org ember deploy org-staging-pull-request --activate
  DEPLOYMENT_EXIT_CODE=$? TLD=org ENVIRONMENT=staging ./config/deployment/update-github-status.sh

  API_ENDPOINT=https://api-staging.travis-ci.com TRAVIS_PRO=true ember deploy com-staging-pull-request --activate
  DEPLOYMENT_EXIT_CODE=$? TLD=com ENVIRONMENT=staging ./config/deployment/update-github-status.sh

  export CLEANED_BRANCH_SUBDOMAIN=`echo ${CLEANED_BRANCH_SUBDOMAIN/staging/production}`
else
    echo "Skipping com- and org-staging PR deployments: no 'staging' in branch name."
fi

ember deploy org-production-pull-request --activate
DEPLOYMENT_EXIT_CODE=$? TLD=org ENVIRONMENT=production ./config/deployment/update-github-status.sh

TRAVIS_PRO=true ember deploy com-production-pull-request --activate
DEPLOYMENT_EXIT_CODE=$? TLD=com ENVIRONMENT=production ./config/deployment/update-github-status.sh
