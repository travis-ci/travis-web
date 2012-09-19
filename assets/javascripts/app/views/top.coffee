require 'travis/auth'

@Travis.reopen
  TopView: Travis.View.extend
    templateName: 'layouts/top'

    tabBinding: 'controller.tab'
    userBinding: 'controller.user'

    gravatarUrl: (->
      "https://www.gravatar.com/avatar/#{@get('user.gravatarId')}?s=24&d=mm"
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
      if Travis.app.get('currentUser')
        classes.push('signed-in')
      else if Travis.app.get('signingIn')
        classes.push('signing-in')
      else
        classes.push('sign-in')
      classes.join(' ')
    ).property('tab', 'Travis.app.currentUser', 'Travis.app.signingIn')

    showProfile: ->
      $('#top .profile ul').show()

    hideProfile: ->
      $('#top .profile ul').hide()

