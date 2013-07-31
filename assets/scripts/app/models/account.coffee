require 'travis/model'

@Travis.Account = Travis.Model.extend
  primaryKey: 'login'
  login:       Ember.attr('string')
  name:        Ember.attr('string')
  type:        Ember.attr('string')
  reposCount:  Ember.attr(Number)

  urlGithub: (->
    "http://github.com/#{@get('login')}"
  ).property()
