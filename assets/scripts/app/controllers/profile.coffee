Travis.ProfileController = Travis.Controller.extend
  name: 'profile'

  needs: ['currentUser', 'accounts', 'account']
  userBinding: 'controllers.currentUser'
  accountBinding: 'controllers.account'

  activate: (action, params) ->
    this["view#{$.camelize(action)}"]()

  viewHooks: ->
    @connectTab('hooks')
    @get('controllers.account').reloadHooks()

  viewUser: ->
    @connectTab('user')

  connectTab: (tab) ->
    if tab == 'user'
      view = 'AccountsInfoView'
    else
      view = "#{$.camelize(tab)}View"
    viewClass = Travis[view]
    @set('tab', tab)

  billingUrl: (->
    id = if @get('account.type') == 'user' then 'user' else @get('account.login')
    "#{Travis.config.billing_endpoint}/subscriptions/#{id}"
  ).property('account.login', 'account.type')
