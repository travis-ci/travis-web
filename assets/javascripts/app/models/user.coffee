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

  urlGithub: (->
    "http://github.com/#{@get('login')}"
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

