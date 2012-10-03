@Travis.reopen
  ProfileView: Travis.View.extend
    templateName: 'profile/show'
    accountBinding: 'controller.account'

    name: (->
      @get('account.name') || @get('account.login')
    ).property('account.name', 'account.login')

  ProfileTabsView: Travis.View.extend
    templateName: 'profile/tabs'
    tabBinding: 'controller.tab'

    activate: (event) ->
      @get('controller').activate(event.target.name)

    classHooks: (->
      'active' if @get('tab') == 'hooks'
    ).property('tab')

    classUser: (->
      'active' if @get('tab') == 'user'
    ).property('tab')

    accountBinding: 'controller.account'

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
      "#{location.protocol}//www.gravatar.com/avatar/#{@get('user.gravatarId')}?s=48&d=mm"
    ).property('user.gravatarId')

    # locale: (->
    #   @get('user.locale')
    # ).property('user.locale')

    locales: (->
      [
        { key: null, name: '' }
        { key: 'en', name: 'English' }
        { key: 'ca', name: 'Catalan' }
        { key: 'cs', name: 'Čeština' }
        { key: 'es', name: 'Español' }
        { key: 'fr', name: 'Français' }
        { key: 'ja', name: '日本語' }
        { key: 'nl', name: 'Nederlands' }
        { key: 'nb', name: 'Norsk Bokmål' }
        { key: 'pl', name: 'Polski' }
        { key: 'pt-BR': name: 'Português brasileiro' }
        { key: 'ru', name: 'Русский' }
      ]
    ).property()

    saveLocale: (event) ->
      @get('user').updateLocale($('#locale').val())
