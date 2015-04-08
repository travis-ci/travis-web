`import TravisRoute from 'travis/routes/basic'`

Route = TravisRoute.extend
  redirect: ->
    if @signedIn()
      @transitionTo('main.repositories')
    else
      @transitionTo('home')

`export default Route`
