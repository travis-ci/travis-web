require 'travis/model'

Repo = Travis.Repo

@Travis.Hook = Travis.Model.extend
  name:        DS.attr()
  ownerName:   DS.attr()
  description: DS.attr()
  active:      DS.attr('boolean')
  admin:       DS.attr('boolean')
  private:     DS.attr('boolean')

  account: (->
    @get('slug').split('/')[0]
  ).property('slug')

  slug: (->
    "#{@get('ownerName')}/#{@get('name')}"
  ).property('ownerName', 'name')

  urlGithub: (->
    "#{Travis.config.source_endpoint}/#{@get('slug')}"
  ).property()

  urlGithubAdmin: (->
    "#{Travis.config.source_endpoint}/#{@get('slug')}/settings/hooks#travis_minibucket"
  ).property()

  toggle: ->
    return if @get('isSaving')
    @set 'active', !@get('active')
    @save()

  repo: (->
    # I don't want to make an ajax request for each repository showed in profile,
    # especially, because most of them does not have any builds anyway. That's why
    # I add an info which we have here to the store - this will allow to display
    # a link to the repo and if more info is needed, it will be requested when the
    # link is used
    @store.push('repo', @getProperties('id', 'slug'))
    @store.getById('repo', @get('id'))
  ).property('id')
