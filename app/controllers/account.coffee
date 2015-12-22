`import Ember from 'ember'`

Controller = Ember.Controller.extend
  allHooks: []
  userBinding: 'auth.currentUser'

  init: ->
    @_super.apply this, arguments

    self = this
    Travis.on("user:synced", (->
      self.reloadHooks()
    ))

  actions:
    sync: ->
      @get('user').sync()

    toggle: (hook) ->
      hook.toggle()

  reloadHooks: ->
    if login = @get('model.login')
      hooks = @store.query('hook', all: true, owner_name: login)

      hooks.then () ->
        hooks.set('isLoaded', true)

      @set('allHooks', hooks)

  accountName: (->
    @get('model.name') || @get('model.login')
  ).property('model.name', 'model.login')

  hooks: (->
    @reloadHooks() unless hooks = @get('allHooks')
    @get('allHooks').filter (hook) -> hook.get('admin')
  ).property('allHooks.length', 'allHooks')

  hooksWithoutAdmin: (->
    @reloadHooks() unless hooks = @get('allHooks')
    @get('allHooks').filter (hook) -> !hook.get('admin')
  ).property('allHooks.length', 'allHooks')

  showPrivateReposHint: (->
    @config.show_repos_hint == 'private'
  ).property()

  showPublicReposHint: (->
    @config.show_repos_hint == 'public'
  ).property()

  billingUrl: ( ->
    id = if @get('model.type') == 'user' then 'user' else @get('model.login')
    "#{@config.billingEndpoint}/subscriptions/#{id}"
  ).property('model.name', 'model.login')

  subscribeButtonInfo: (->
    {
      billingUrl: @get('billingUrl')
      subscribed: @get('model.subscribed')
      education: @get('model.education')
    }
  ).property('model.login', 'model.type')

`export default Controller`
