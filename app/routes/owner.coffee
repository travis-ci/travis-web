`import Ember from 'ember'`
`import TravisRoute from 'travis/routes/basic'`
`import Ajax from 'travis/utils/ajax'`

Route = TravisRoute.extend
  needsAuth: false
  # controllerName: 'owner'

  model: (params) ->
    owner = {}

    $.get("https://api-staging.travis-ci.org/v3/owner/#{params.owner}?include=user.repositories,organization.repositories,build.commit,repository.active").then( (data) ->
      data
    )

`export default Route`
