@Travis.reopen
  TopView: Travis.View.extend
    templateName: 'layouts/top'

    tabBinding: 'controller.tab'

    # hrm. how to parametrize bind-attr?
    classHome: (->
      'active' if @get('tab') == 'home'
    ).property('tab')

    classStats: (->
      'active' if @get('tab') == 'stats'
    ).property('tab')

    classProfile: (->
      classes = ['profile menu']
      classes.push('active') if @get('tab') == 'profile'
      classes.push(Travis.get('authState') || 'signed-out')
      classes.join(' ')
    ).property('tab', 'Travis.authState')

    showProfile: ->
      $('#top .profile ul').show()

    hideProfile: ->
      $('#top .profile ul').hide()

