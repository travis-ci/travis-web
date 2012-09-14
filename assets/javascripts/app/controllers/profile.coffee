Travis.ProfileController = Travis.Controller.extend
  name: 'profile'
  userBinding: 'Travis.app.currentUser'

  init: ->
    @_super()
    #    @_super('top', 'accounts')
    #    @connectTop()
    #    @connectOutlet outletName: 'left', controller: @accountsController, viewClass: Travis.AccountsView
    #    @connectOutlet(outletName: 'main', controller: this, viewClass: Travis.ProfileView)
    #    @accounts = @accountsController.get('content')

  account: (->
    login = @get('params.login') || Travis.app.get('currentUser.login')
    @accounts.toArray().filter((account) -> account if account.get('login') == login)[0]
  ).property('accounts.length', 'params.login')

  activate: (action, params) ->
    @setParams(params || @get('params'))
    this["view#{$.camelize(action)}"]()

  viewHooks: ->
    @connectTab('hooks')
    @set('hooks', Travis.Hook.find(owner_name: @get('params.login') || Travis.app.get('currentUser.login')))

  viewUser: ->
    @connectTab('user')

  connectTab: (tab) ->
    viewClass = Travis["#{$.camelize(tab)}View"]
    @set('tab', tab)
    @connectOutlet(outletName: 'pane', controller: this, viewClass: viewClass)

  setParams: (params) ->
    @set('params', {})
    @set("params.#{key}", params[key]) for key, value of params


