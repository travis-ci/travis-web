require 'travis/ajax'
require 'travis/model'

@Travis.User = Travis.Model.extend
  _name:       DS.attr('string')
  email:       DS.attr('string')
  login:       DS.attr('string')
  token:       DS.attr('string')
  locale:      DS.attr('string')
  gravatarId:  DS.attr('string')
  isSyncing:   DS.attr('boolean')
  syncedAt:    DS.attr('string')
  repoCount:   DS.attr('number')

  # This is the only way I found to override the attribue created with DS.attr
  name: Ember.computed( (key, value) ->
    if arguments.length == 1
      @get('_name') || @get('login')
    else
      @set('_name', value)
      value
  ).property('login', '_name')

  init: ->
    @_super()

    Ember.run.next this, ->
      @poll() if @get('isSyncing')

    Ember.run.next this, ->
      transaction = @get('store').transaction()
      transaction.add this

  urlGithub: (->
    "https://github.com/#{@get('login')}"
  ).property()

  permissions: (->
    unless @permissions
      @permissions = Ember.ArrayProxy.create(content: [])
      Travis.ajax.get('/users/permissions', (data) => @permissions.set('content', data.permissions))
    @permissions
  ).property()

  updateLocale: (locale) ->

    transaction = @get('transaction')
    transaction.commit()

    self = this
    observer = ->
      unless self.get('isSaving')
        self.removeObserver 'isSaving', observer
        transaction = self.get('store').transaction()
        transaction.add self

    @addObserver 'isSaving', observer
    Travis.setLocale(locale)

  type: (->
    'user'
  ).property()

  sync: ->
    self = this
    Travis.ajax.post('/users/sync', {}, ->
      self.setWithSession('isSyncing', true)
      self.poll()
    )

  poll: ->
    Travis.ajax.get '/users', (data) =>
      if data.user.is_syncing
        Ember.run.later(this, this.poll.bind(this), 3000)
      else
        @set('isSyncing', false)
        @setWithSession('syncedAt', data.user.synced_at)
        Travis.trigger('user:synced', data.user)

        # need to pass any param to trigger findQuery
        Travis.Account.find(foo: '')

  setWithSession: (name, value) ->
    @set(name, value)
    user = JSON.parse(Travis.sessionStorage.getItem('travis.user'))
    user[$.underscore(name)] = @get(name)
    Travis.sessionStorage.setItem('travis.user', JSON.stringify(user))
