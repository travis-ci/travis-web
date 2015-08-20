`import TravisRoute from 'travis/routes/basic'`
`import config from 'travis/config/environment'`
`import BuildFaviconMixin from 'travis/mixins/build-favicon'`

Route = TravisRoute.extend BuildFaviconMixin,
  needsAuth: false

  beforeModel: ->
    @_super.apply(this, arguments)

    @get('auth').refreshUserData().then (->), =>
      @get('auth').signOut()

  renderTemplate: ->
    if @get('config').pro
      $('body').addClass('pro')

    @_super.apply(this, arguments)

  activate: ->
    @get('stylesheetsManager').disable('dashboard')

    if !config.pro
      repos = @get('store').peekAll('repo')
      repos.forEach (repo) =>
        @subscribeToRepo(repo)

      repos.addArrayObserver(this, willChange: 'reposWillChange', didChange: 'reposDidChange')

  reposWillChange: (->)

  reposDidChange: (array, start, removedCount, addedCount) ->
    addedRepos = array.slice(start, start + addedCount)
    addedRepos.forEach (repo) =>
      @subscribeToRepo(repo)

  subscribeToRepo: (repo) ->
    if @pusher
      @pusher.subscribe "repo-#{repo.get('id')}"

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
