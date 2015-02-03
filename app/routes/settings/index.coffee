`import TravisRoute from 'travis/routes/basic'`

Route = TravisRoute.extend
  model: ->
    repo = @modelFor('repo')
    repo.fetchSettings().then (settings) ->
      repo.set('settings', settings)

`export default Route`
