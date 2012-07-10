@Travis.reopen
  TopView: Em.View.extend
    templateName: 'layouts/top'

    tabBinding: 'controller.tab'
    userBinding: 'controller.user'

    # currentUser: (->
    #   Travis.app.currentUser
    # ).property('Travis.app.currentUser')

    gravatarUrl: (->
      "http://www.gravatar.com/avatar/#{@getPath('user.gravatar')}?s=24&d=mm"
    ).property('user.gravatar')

    # hrm. how to parametrize bindAttr?
    classHome: (->
      'active' if @get('tab') == 'home'
    ).property('tab')

    classStats: (->
      'active' if @getPath('tab') == 'stats'
    ).property('tab')

    classProfile: (->
      if @getPath('tab') == 'profile' then 'profile active' else 'profile'
    ).property('tab')

    showProfile: ->
      $('#top .profile ul').show()

    hideProfile: ->
      $('#top .profile ul').hide()

