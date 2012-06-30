require 'travis/model'

@Travis.Profile = Travis.Model.extend
  name:        DS.attr('string')
  email:       DS.attr('string')
  login:       DS.attr('string')
  token:       DS.attr('string')
  gravatarUrl: DS.attr('string')

  urlGithub: (->
    "http://github.com/#{@get('login')}"
  ).property()

@Travis.Profile.reopenClass
  find: ->
    @_super(Travis.currentUserId) if Travis.currentUserId

  buildURL: ->
    'profile'

