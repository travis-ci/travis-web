@Travis.reopen
  AccountsView: Travis.View.extend
    tabBinding: 'controller.tab'
    templateName: 'profile/accounts'
    classAccounts: (->
      'active' if @get('tab') == 'accounts'
    ).property('tab')

  AccountsListView: Em.CollectionView.extend
    elementId: 'accounts'
    accountBinding: 'content'
    tagName: 'ul'

    emptyView: Ember.View.extend
      template: Ember.Handlebars.compile('<div class="loading"><span>Loading</span></div>')

    itemViewClass: Travis.View.extend
      accountBinding: 'content'
      typeBinding: 'content.type'
      selectedBinding: 'account.selected'

      classNames: ['account']
      classNameBindings: ['type', 'selected']

      name: (->
        @get('content.name') || @get('content.login')
      ).property('content.login', 'content.name')

      urlAccount: (->
        Travis.Urls.account(@get('account.login'))
      ).property('account.login')

      click: ->
        @get('controller').transitionToRoute("account", @get('account.login'))
