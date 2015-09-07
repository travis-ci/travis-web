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

    $.ajax("#{apiEndpoint}/repos/#{repoId}/branch/master", options).then (response) ->
      
      console.log(response)
      # response.repositories.sortBy('last_build.finished_at').filter( (repo) ->
      #   repo.last_build
      # ).map( (repo) ->
      #   Ember.Object.create(repo)
      # )


`export default Route`
