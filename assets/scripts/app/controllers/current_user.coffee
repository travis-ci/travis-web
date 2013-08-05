Travis.CurrentUserController = Em.ObjectController.extend
  sync: ->
    @get('content').sync()

  syncingDidChange: (->
    if (user = @get('content')) && user.get('isSyncing') && !user.get('syncedAt')
      @container.lookup('router:main').send('renderFirstSync')
  ).observes('isSyncing', 'content')
