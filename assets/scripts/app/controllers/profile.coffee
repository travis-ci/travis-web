Travis.ProfileController = Travis.Controller.extend
  name: 'profile'

  needs: ['currentUser', 'accounts']
  userBinding: 'controllers.currentUser'
  accountsBinding: 'controllers.accounts'

  init: ->
    @_super.apply this, arguments

    self = this
    Travis.on("user:synced", (->
      self.reloadHooks()
    ))

  account: (->
    login = @get('params.login') || @get('user.login')
    account = @get('accounts').filter((account) -> account if account.get('login') == login)[0]
    account.select() if account
    account
  ).property('accounts.length', 'params.login')

  activate: (action, params) ->
    @setParams(params || @get('params'))
    this["view#{$.camelize(action)}"]()

  viewHooks: ->
    @connectTab('hooks')
    @reloadHooks()

  reloadHooks: ->
    @set('hooks', Travis.Hook.find(owner_name: @get('params.login') || @get('user.login')))

  viewUser: ->
    @connectTab('user')

  connectTab: (tab) ->
    viewClass = Travis["#{$.camelize(tab)}View"]
    @set('tab', tab)

  setParams: (params) ->
    @set('params', {})
    @set("params.#{key}", params[key]) for key, value of params


