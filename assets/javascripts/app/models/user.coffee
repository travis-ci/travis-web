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
  accessToken: DS.attr('string')

  init: ->
    @poll() if @get('isSyncing')
    @._super()

  urlGithub: (->
    "https://github.com/#{@get('login')}"
  ).property()

  updateLocale: (locale) ->
    @set('locale', locale)
    Travis.app.store.commit()

  type: (->
    'user'
  ).property()

  sync: ->
    @post('/profile/sync')
    @set('isSyncing', true)
    @poll()

  poll: ->
    @ajax '/profile', 'get', success: (data) =>
      if data.user.is_syncing
        Ember.run.later(this, this.poll.bind(this), 3000)
      else if this.get('isSyncing')
        # TODO this doesn't seem to work properly
        Travis.app.store.load(Travis.User, data.user)
        Travis.app.store.loadMany(Travis.Account, data.accounts)
