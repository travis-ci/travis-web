`import SimpleLayoutRoute from 'travis/routes/simple-layout'`

Route = SimpleLayoutRoute.extend
  activate: ->
    controller = @controllerFor('firstSync')
    controller.addObserver('isSyncing', this, @isSyncingDidChange)

  deactivate: ->
    controller = @controllerFor('firstSync')
    controller.removeObserver('controller.isSyncing', this, @isSyncingDidChange)

  isSyncingDidChange: ->
    controller = @controllerFor('firstSync')

    if !controller.get('isSyncing')
      self = this
      Ember.run.later this, ->
        @store.query('repo', member: @get('controller.user.login')).then( (repos) ->
          if repos.get('length')
            self.transitionTo('main')
          else
            self.transitionTo('profile')
        ).then(null, (e) ->
          console.log('There was a problem while redirecting from first sync', e)
        )
      , @get('config').syncingPageRedirectionTime

  actions:
    redirectToGettingStarted: ->
      # do nothing, we are showing first sync, so it's normal that there is
      # no owned repos

`export default Route`
