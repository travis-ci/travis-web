require 'travis/ajax'
require 'travis/model'

Ajax = Travis.ajax
trigger = Travis.trigger
Account = Travis.Account

@Travis.User = Travis.Model.extend
  name:        DS.attr()
  email:       DS.attr()
  login:       DS.attr()
  token:       DS.attr()
  gravatarId:  DS.attr()
  isSyncing:   DS.attr('boolean')
  syncedAt:    DS.attr()
  repoCount:   DS.attr('number')

  fullName: (->
    @get('name') || @get('login')
  ).property('name', 'login')

  isSyncingDidChange: (->
    Ember.run.next this, ->
      @poll() if @get('isSyncing')
  ).observes('isSyncing')

  urlGithub: (->
    "#{Travis.config.source_endpoint}/#{@get('login')}"
  ).property()

  _rawPermissions: (->
    Ajax.get('/users/permissions')
  ).property()

  permissions: (->
    permissions = Ember.ArrayProxy.create(content: [])
    @get('_rawPermissions').then (data) => permissions.set('content', data.permissions)
    permissions
  ).property()

  adminPermissions: (->
    permissions = Ember.ArrayProxy.create(content: [])
    @get('_rawPermissions').then (data) => permissions.set('content', data.admin)
    permissions
  ).property()

  pullPermissions: (->
    permissions = Ember.ArrayProxy.create(content: [])
    @get('_rawPermissions').then (data) => permissions.set('content', data.pull)
    permissions
  ).property()

  pushPermissions: (->
    permissions = Ember.ArrayProxy.create(content: [])
    @get('_rawPermissions').then (data) => permissions.set('content', data.push)
    permissions
  ).property()

  type: (->
    'user'
  ).property()

  sync: ->
    self = this
    Ajax.post('/users/sync', {}, ->
      self.setWithSession('isSyncing', true)
    )

  poll: ->
    Ajax.get '/users', (data) =>
      if data.user.is_syncing
        self = this
        setTimeout ->
          self.poll()
        , 3000
      else
        @set('isSyncing', false)
        @setWithSession('syncedAt', data.user.synced_at)
        trigger('user:synced', data.user)

        # need to pass any param to trigger findQuery
        Account.find(foo: '')

  setWithSession: (name, value) ->
    @set(name, value)
    user = JSON.parse(Travis.sessionStorage.getItem('travis.user'))
    user[$.underscore(name)] = @get(name)
    Travis.sessionStorage.setItem('travis.user', JSON.stringify(user))
