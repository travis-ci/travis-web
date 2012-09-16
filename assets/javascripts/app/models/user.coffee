require 'travis/model'

@Travis.User = Travis.Model.extend
  name:      DS.attr('string')
  email:     DS.attr('string')
  login:     DS.attr('string')
  token:     DS.attr('string')
  locale:    DS.attr('string')
  gravatar:  DS.attr('string')
  isSyncing: DS.attr('boolean')
  syncedAt:  DS.attr('string')
  repoCount: DS.attr('number')

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

  accounts: (->
    [this].concat Travis.Account.filter().toArray()
  ).property()

  sync: ->
    $.post('/api/profile/sync')
    @set('isSyncing', true)
    @poll()

  poll: ->
    $.get('/api/profile', ((data) ->
      if data.user.is_syncing
        Ember.run.later(this, this.poll.bind(this), 3000)
      else if this.get('isSyncing')
        # TODO this doesn't seem to work properly
        Travis.app.store.load(Travis.User, data.user)
        Travis.app.store.loadMany(Travis.Account, data.accounts)
    ).bind(this))
