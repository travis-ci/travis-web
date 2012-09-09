@Travis.reopen
  OwnersView: Travis.View.extend
    tabBinding: 'controller.tab'
    templateName: 'profile/owners'
    classAccounts: (->
      'active' if @get('tab') == 'accounts'
    ).property('tab')

  OwnersListView: Em.CollectionView.extend
    elementId: 'owners'
    ownerBinding: 'content'
    tagName: 'ul'

    emptyView: Ember.View.extend
      template: Ember.Handlebars.compile('<div class="loading"><span>Loading</span></div>')

    itemViewClass: Travis.View.extend
      ownerBinding: 'content'
      typeBinding: 'content.type'
      selectedBinding: 'owner.selected'

      classNames: ['owner']
      classNameBindings: ['type', 'selected']

      name: (->
        @get('content.name') || @get('content.login')
      ).property('content.login', 'content.name')

      urlOwner: (->
        Travis.Urls.owner(@get('owner.login'))
      ).property('owner.login')

  ProfileView: Travis.View.extend
    templateName: 'profile/show'

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

    displayUser: (->
      @get('controller.owner.login') == @get('controller.user.login')
    ).property('controller.owner.login', 'controller.user.login')

  HooksView: Travis.View.extend
    templateName: 'profile/tabs/hooks'

    urlGithubAdmin: (->
      Travis.Urls.githubAdmin(@get('hook.slug'))
    ).property('hook.slug')

  UserView: Travis.View.extend
    templateName: 'profile/tabs/user'
    userBinding: 'controller.user'

    gravatarUrl: (->
      "http://www.gravatar.com/avatar/#{@get('user.gravatar')}?s=48&d=mm"
    ).property('user.gravatar')

    locales: (->
      [
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
