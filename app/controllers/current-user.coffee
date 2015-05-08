Controller = Ember.Controller.extend
  sync: ->
    @get('model').sync()

  model: Ember.computed.alias('auth.currentUser')

  syncingDidChange: (->
    if (user = @get('model')) && user.get('isSyncing') && !user.get('syncedAt')
      Ember.run.scheduleOnce 'routerTransitions', this, ->
        @container.lookup('router:main').send('renderFirstSync')
  ).observes('isSyncing', 'auth.currentUser')

`export default Controller`
