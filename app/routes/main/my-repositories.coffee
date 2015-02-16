`import TravisRoute from 'travis/routes/basic'`

Route = TravisRoute.extend
  redirect: ->
    @transitionTo("main.repositories")

`export default Route`
