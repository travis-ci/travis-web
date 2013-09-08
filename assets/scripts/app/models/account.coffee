require 'travis/model'

@Travis.Account = Travis.Model.extend
  login:       Ember.attr('string')
  name:        Ember.attr('string')
  type:        Ember.attr('string')
  _reposCount:  Ember.attr(Number, key: 'repos_count')

  urlGithub: (->
    "#{Travis.config.source_endpoint}/#{@get('login')}"
  ).property()

  # TODO: maybe it would be good to add a "default" value for Ember.attr
  reposCount: (->
    @get('_reposCount') || 0
  ).property('_reposCount')

Travis.Account.primaryKey = 'login'
