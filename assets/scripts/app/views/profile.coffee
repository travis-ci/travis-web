Travis.reopen
  ProfileView: Travis.View.extend
    templateName: 'profile/show'
    accountBinding: 'controller.account'

    name: (->
      @get('account.name') || @get('account.login')
    ).property('account.name', 'account.login')

  ProfileTabsView: Travis.View.extend
    templateName: 'profile/tabs'
    tabBinding: 'controller.tab'

    activate: ->
      @get('controller').activate(event.target.name)

    classHooks: (->
      'active' if @get('tab') == 'hooks'
    ).property('tab')

    classUser: (->
      'active' if @get('tab') == 'user'
    ).property('tab')

    displayUser: (->
      @get('controller.account.login') == @get('controller.user.login')
    ).property('controller.account.login', 'controller.user.login')

  HooksView: Travis.View.extend
    templateName: 'profile/tabs/hooks'
    userBinding: 'controller.user'

    urlGithubAdmin: (->
      Travis.Urls.githubAdmin(@get('hook.slug'))
    ).property('hook.slug')

  UserView: Travis.View.extend
    templateName: 'profile/tabs/user'
    userBinding: 'controller.user'

    gravatarUrl: (->
      "#{location.protocol}//www.gravatar.com/avatar/#{@get('user.gravatarId')}?s=200&d=mm"
    ).property('user.gravatarId')
