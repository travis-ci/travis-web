`import TravisRoute from 'travis/routes/basic'`
`import config from 'travis/config/environment'`
`import BuildFaviconMixin from 'travis/mixins/build-favicon'`

Route = TravisRoute.extend BuildFaviconMixin,
  needsAuth: false

  beforeModel: ->
    @_super.apply(this, arguments)

    @get('auth').refreshUserData()

  renderTemplate: ->
    if @get('config').pro
      $('body').addClass('pro')

    @_super.apply(this, arguments)

  activate: ->
    @get('stylesheetsManager').disable('dashboard')

  title: (titleParts) ->
    if titleParts.length
      titleParts = titleParts.reverse()
      titleParts.push('Travis CI')
      titleParts.join(' - ')
    else
      config.defaultTitle

  actions:
    redirectToGettingStarted: ->
      # do nothing, we handle it only in index path

    renderDefaultTemplate: ->
      @renderDefaultTemplate() if @renderDefaultTemplate

    error: (error) ->
      if error == 'needs-auth'
        authController = @container.lookup('controller:auth')
        authController.set('redirected', true)
        @transitionTo('auth')
      else
        return true

    renderFirstSync: ->
      @transitionTo 'first_sync'

    afterSignIn: ->
      if transition = @auth.get('afterSignInTransition')
        @auth.set('afterSignInTransition', null)
        transition.retry()
      else
        @transitionTo('main')

    afterSignOut: ->
      if @get('config').pro
        @transitionTo('auth')
      else
        @transitionTo('home')

`export default Route`
