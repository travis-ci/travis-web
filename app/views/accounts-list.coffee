accountUrl = Travis.Urls.account

View = Ember.CollectionView.extend
  elementId: 'accounts'
  accountBinding: 'content'
  tagName: 'ul'

  emptyView: Ember.View.extend
    template: Ember.Handlebars.compile('<div class="loading"><span>Loading</span></div>')

  itemViewClass: Ember.View.extend
    accountBinding: 'content'
    typeBinding: 'content.type'
    selectedBinding: 'account.selected'

    classNames: ['account']
    classNameBindings: ['type', 'selected']

    name: (->
      @get('content.name') || @get('content.login')
    ).property('content.login', 'content.name')

    urlAccount: (->
      accountUrl(@get('account.login'))
    ).property('account.login')

    click: ->
      @get('controller').transitionToRoute("account", @get('account.login'))

AccountsListView = View
