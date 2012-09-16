require 'travis/auth'

@Travis.reopen
  TopView: Travis.View.extend
    templateName: 'layouts/top'

    tabBinding: 'controller.tab'
    userBinding: 'controller.user'

    gravatarUrl: (->
      "https://www.gravatar.com/avatar/#{@get('user.gravatar')}?s=24&d=mm"
    ).property('user.gravatar')

    # hrm. how to parametrize bindAttr?
    classHome: (->
      'active' if @get('tab') == 'home'
    ).property('tab')

    classStats: (->
      'active' if @get('tab') == 'stats'
    ).property('tab')

    classProfile: (->
      if @get('tab') == 'profile' then 'profile active' else 'profile'
    ).property('tab')

    showProfile: ->
      $('#top .profile ul').show()

    hideProfile: ->
      $('#top .profile ul').hide()

