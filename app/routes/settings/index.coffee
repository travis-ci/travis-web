`import TravisRoute from 'travis/routes/basic'`
`import config from 'travis/config/environment'`

Route = TravisRoute.extend
  titleToken: 'Settings'

  model: ->
    repo = @modelFor('repo')

    repo.fetchSettings().then (settings) ->

      console.log(settings)
      repo.set('settings', settings)

    # return {

    #   settings: (->
    #     $.ajax('https://api.travis-ci.org/v3/repos/#{repo.id}/settings', {
    #       headers: {
    #         Authorization: 'token ' + @auth.token()
    #       }
    #     }).then (response) ->
    #       console.log(response);
    #       return response
    #     )
    #   env_vars: (->
    #     $.ajax('/settings/env_vars?repository_id={repo.id}', {
    #       headers: {
    #         Authorization: 'token ' + @auth.token()
    #       }
    #     }).then (response) ->
    #       console.log(response);
    #       return response
    #     )
    # }

`export default Route`
