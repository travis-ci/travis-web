@Travis.Views.reopen
  TopView: Em.View.extend
    templateName: 'layouts/top'

    currentUser: (->
      Travis.app.currentUser
    ).property('Travis.app.currentUser')

    gravatarUrl: (->
      "http://www.gravatar.com/avatar/#{@getPath('controller.user.gravatar')}?s=24&d=mm"
    ).property('controller.user.gravatar')

    # hrm. how to parametrize bindAttr?
    classHome: (->
      'active' if @getPath('controller.tab') == 'home'
    ).property('controller.tab')

    classStats: (->
      'active' if @getPath('controller.tab') == 'stats'
    ).property('controller.tab')

    classProfile: (->
      if @getPath('controller.tab') == 'profile' then 'profile active' else 'profile'
    ).property('controller.tab')


