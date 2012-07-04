require 'travis/model'

@Travis.Hook = Travis.Model.extend
  primaryKey: 'slug'
  slug:        DS.attr('string')
  description: DS.attr('string')
  active:      DS.attr('boolean')

  owner: (->
    @get('slug').split('/')[0]
  ).property('slug')

  name: (->
    @get('slug').split('/')[1]
  ).property('slug')

  urlGithub: (->
    "http://github.com/#{@get('slug')}"
  ).property()

  urlGithubAdmin: (->
    "http://github.com/#{@get('slug')}/admin/hooks#travis_minibucket"
  ).property()

  toggle: ->
    @set 'active', !@get('active')
    Travis.app.store.commit()

@Travis.Hook.reopenClass
  url: 'profile/hooks'


