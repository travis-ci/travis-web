`import TravisRoute from 'travis/routes/basic'`

Route = TravisRoute.extend
  redirect: ->
    target = if @signedIn() then 'repositories' else 'recent'
    @transitionTo("main.#{target}")

`export default Route`
