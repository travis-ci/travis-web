Travis.ProfileController = Travis.Controller.extend
  name: 'profile'
  userBinding: 'Travis.app.currentUser'

  init: ->
    @_super('top', 'owners')
    @connectTop()
    @connectOutlet outletName: 'left', controller: @ownersController, viewClass: Travis.OwnersView
    @connectOutlet(outletName: 'main', controller: this, viewClass: Travis.ProfileView)
    @owners = @ownersController.get('content')

  owner: (->
    login = @get('params.login') || Travis.app.get('currentUser.login')
    @owners.toArray().filter((owner) -> owner if owner.get('login') == login)[0]
  ).property('owners.length', 'params.login')

  activate: (action, params) ->
    @setParams(params || @get('params'))
    this["view#{$.camelize(action)}"]()

  viewHooks: ->
    @connectTab('hooks')
    @set('hooks', Travis.Hook.find(login: @get('params.login') || Travis.app.get('currentUser.login')))

  viewUser: ->
    @connectTab('user')

  connectTab: (tab) ->
    viewClass = Travis["#{$.camelize(tab)}View"]
    @set('tab', tab)
    @connectOutlet(outletName: 'pane', controller: this, viewClass: viewClass)

  setParams: (params) ->
    @set('params', {})
    @set("params.#{key}", params[key]) for key, value of params


