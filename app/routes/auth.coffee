`import TravisRoute from 'travis/routes/basic'`

Route = TravisRoute.extend
  needsAuth: false

  renderTemplate: ->
    $('body').attr('id', 'auth')

    @render 'auth.signin'

  deactivate: ->
    @controllerFor('auth').set('redirected', false)

  actions:
    afterSignIn: ->
      @transitionTo('main')
      return true

  redirect: ->
    if @signedIn()
      @transitionTo('main')

`export default Route`
