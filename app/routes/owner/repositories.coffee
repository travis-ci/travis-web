`import Ember from 'ember'`
`import TravisRoute from 'travis/routes/basic'`
`import Ajax from 'travis/utils/ajax'`
`import config from 'travis/config/environment'`

Route = TravisRoute.extend
  needsAuth: false

  titleToken: (model) ->
    "#{model.name}"

  model: (params, transition) ->
    options = {}
    if @get('auth.signedIn')
      options.headers = { Authorization: "token #{@auth.token()}" }
    $.ajax(config.apiEndpoint + "/v3/repos?repository.active=true&include=user.repositories,organization.repositories,build.commit", options)

`export default Route`
