`import Ember from 'ember'`
`import TravisRoute from 'travis/routes/basic'`
`import config from 'travis/config/environment'`

Route = TravisRoute.extend
  needsAuth: false

  titleToken: (model) ->
    "#{model.name}"

  model: (params, transition) ->
    options = {}
    if @get('auth.signedIn')
      options.headers = { Authorization: "token #{@auth.token()}" }
    $.ajax(config.apiEndpoint + "/v3/owner/#{transition.params.owner.owner}?include=owner.repositories,repository.default_branch,build.commit", options).then (response) ->
      response

`export default Route`
