`import Ember from 'ember'`

Controller = Ember.ObjectController.extend
  allHooks: []
  needs: ['currentUser']
  userBinding: 'controllers.currentUser'

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
    if login = @get('login')
      hooks = @store.find('hook', all: true, owner_name: login)

      hooks.then () ->
        hooks.set('isLoaded', true)

      @set('allHooks', hooks)

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
  ) .property()

  showPublicReposHint: (->
    @config.show_repos_hint == 'public'
  ) .property()

`export default Controller`
