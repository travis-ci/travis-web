require 'travis/model'

@Travis.User = Travis.Model.extend
  name:     DS.attr('string')
  email:    DS.attr('string')
  login:    DS.attr('string')
  token:    DS.attr('string')
  locale:   DS.attr('string')
  gravatar: DS.attr('string')

  urlGithub: (->
    "http://github.com/#{@get('login')}"
  ).property()

  updateLocale: (locale) ->
    @set('locale', locale)
    Travis.app.store.commit()
