`import TravisRoute from 'travis/routes/basic'`

Route = TravisRoute.extend
  model: (params) ->
    repo = @modelFor('repo')
    repo.get('envVars.promise')

`export default Route`
