delegate = (name, options) ->
  options ||= options
  ->
    target = @get(options.to)
    target[name].apply(target, arguments)

Travis.CurrentUserController = Em.ObjectController.extend
  sync: ->
    @get('content').sync()

  content: (->
    @get('auth.currentUser')
  ).property('auth.currentUser')

  syncingDidChange: (->
    if (user = @get('content')) && user.get('isSyncing') && !user.get('syncedAt')
      Ember.run.scheduleOnce 'routerTransitions', this, ->
        @container.lookup('router:main').send('renderFirstSync')
  ).observes('isSyncing', 'content')
