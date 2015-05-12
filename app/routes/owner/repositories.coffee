`import Ember from 'ember'`
`import TravisRoute from 'travis/routes/basic'`
`import Ajax from 'travis/utils/ajax'`
`import config from 'travis/config/environment'`

Route = TravisRoute.extend
  needsAuth: false

  titleToken: (model) ->
    "#{model.name}"

  model: (params, transition) ->
    $.get(config.apiEndpoint + "/v3/owner/#{transition.params.owner.owner}?include=user.repositories,organization.repositories,build.commit,repository.active")

`export default Route`
