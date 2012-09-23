@Travis.reopen
  TopView: Travis.View.extend
    templateName: 'layouts/top'

    tabBinding: 'controller.tab'
    userBinding: 'controller.user'

    gravatarUrl: (->
      "#{location.protocol}//www.gravatar.com/avatar/#{@get('user.gravatarId')}?s=24&d=mm"
    ).property('user.gravatarId')

    # hrm. how to parametrize bindAttr?
    classHome: (->
      'active' if @get('tab') == 'home'
    ).property('tab')

    classStats: (->
      'active' if @get('tab') == 'stats'
    ).property('tab')

    classProfile: (->
      classes = ['profile']
      classes.push('active') if @get('tab') == 'profile'
      classes.push(Travis.app.get('authState'))
      classes.join(' ')
    ).property('tab', 'Travis.app.authState')

    showProfile: ->
      $('#top .profile ul').show()

    hideProfile: ->
      $('#top .profile ul').hide()

