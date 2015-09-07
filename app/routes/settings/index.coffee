`import TravisRoute from 'travis/routes/basic'`
`import config from 'travis/config/environment'`

Route = TravisRoute.extend
  titleToken: 'Settings'

  model: ->
    repo = @modelFor('repo')

    repo.fetchSettings().then (settings) ->

      repo.set('settings', settings)

`export default Route`
