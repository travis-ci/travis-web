`import Ember from 'ember'`
`import TravisRoute from 'travis/routes/basic'`
`import Ajax from 'travis/utils/ajax'`

Route = TravisRoute.extend
  needsAuth: true
  # controllerName: 'owner'

  model: (params) ->
    owner = {}

    $.get("https://api.travis-ci.org/v3/owner/#{params.owner}?include=user.repositories,organization.repositories").then( (data) ->
      owner = data

      owner
    )

`export default Route`
