require 'travis/model'

Travis.Account = Travis.Model.extend
  login:       Ember.attr('string')
  name:        Ember.attr('string')
  type:        Ember.attr('string')
  _reposCount:  Ember.attr(Number, key: 'repos_count')
  subscribed: Ember.attr(Boolean)
  education: Ember.attr(Boolean)

  # TODO: maybe it would be good to add a "default" value for Ember.attr
  reposCount: (->
    @get('_reposCount') || 0
  ).property('_reposCount')

Travis.Account.primaryKey = 'login'
