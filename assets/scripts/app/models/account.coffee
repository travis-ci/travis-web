require 'travis/model'

@Travis.Account = Travis.Model.extend
  primaryKey: 'login'
  login:       DS.attr('string')
  name:        DS.attr('string')
  type:        DS.attr('string')
  reposCount:  DS.attr('number')

  urlGithub: (->
    "http://github.com/#{@get('login')}"
  ).property()

