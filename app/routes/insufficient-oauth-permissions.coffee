`import SimpleLayoutRoute from 'travis/routes/simple-layout'`

Route = SimpleLayoutRoute.extend
  setupController: (controller) ->
    @_super.apply this, arguments
    existingUser = document.location.hash.match(/#existing[_-]user/)
    controller.set('existingUser', existingUser)

`export default Route`
