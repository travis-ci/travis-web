require 'travis/ajax'
require 'travis/model'

@Travis.User = Travis.Model.extend Travis.Ajax,
  name:        DS.attr('string')
  email:       DS.attr('string')
  login:       DS.attr('string')
  token:       DS.attr('string')
  locale:      DS.attr('string')
  gravatarId:  DS.attr('string')
  isSyncing:   DS.attr('boolean')
  syncedAt:    DS.attr('string')
  repoCount:   DS.attr('number')

  init: ->
    @poll() if @get('isSyncing')
    @_super()

    Ember.run.next this, ->
      transaction = @get('store').transaction()
      transaction.add this

  urlGithub: (->
    "https://github.com/#{@get('login')}"
  ).property()

  permissions: (->
    unless @permissions
      @permissions = Ember.ArrayProxy.create()
      @ajax '/users/permissions', 'get', success: (data) => @permissions.set('content', data.permissions)
    @permissions
  ).property()

  updateLocale: (locale) ->
    @setWithSession('locale', locale)

    transaction = @get('transaction')
    transaction.commit()

    self = this
    observer = ->
      unless self.get('isSaving')
        self.removeObserver 'isSaving', observer
        transaction = self.get('store').transaction()
        transaction.add self

    @addObserver 'isSaving', observer

  type: (->
    'user'
  ).property()

  sync: ->
    @post('/users/sync')
    @setWithSession('isSyncing', true)
    @poll()

  poll: ->
    @ajax '/users', 'get', success: (data) =>
      if data.user.is_syncing
        Ember.run.later(this, this.poll.bind(this), 3000)
      else
        @set('isSyncing', false)
        @setWithSession('syncedAt', data.user.synced_at)

        # # TODO this doesn't work properly
        # Travis.app.store.loadMany(Travis.Account, data.accounts)

  setWithSession: (name, value) ->
    @set(name, value)
    user = JSON.parse(sessionStorage?.getItem('travis.user'))
    user[$.underscore(name)] = @get(name)
    sessionStorage?.setItem('travis.user', JSON.stringify(user))
