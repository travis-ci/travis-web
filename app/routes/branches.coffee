`import Ember from 'ember'`
`import TravisRoute from 'travis/routes/basic'`
`import config from 'travis/config/environment'`

Route = TravisRoute.extend

  model: (params) ->
    apiEndpoint = config.apiEndpoint
    repoId = @modelFor('repo').get('id')

    options = {}
    if @get('auth.signedIn')
      options.headers = { Authorization: "token #{@auth.token()}" }

    $.ajax("#{apiEndpoint}/v3/repo/#{repoId}/branches?include=build.commit", options).then (response) ->
      response.branches

`export default Route`
