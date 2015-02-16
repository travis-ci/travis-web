`import TravisRoute from 'travis/routes/basic'`

Route = TravisRoute.extend
  titleToken: 'Environment variables'

  model: (params) ->
    repo = @modelFor('repo')
    repo.get('envVars.promise')

`export default Route`
