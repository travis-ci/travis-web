require 'travis/model'

@Travis.Repository = Travis.Model.extend
  slug:                   DS.attr('string')
  description:            DS.attr('string')
  last_build_id:          DS.attr('number')
  last_build_number:      DS.attr('string')
  last_build_result:      DS.attr('number')
  last_build_started_at:  DS.attr('string')
  last_build_finished_at: DS.attr('string')

  primaryKey: 'slug'

  lastBuild: DS.belongsTo('Travis.Build')

  builds: (->
    Travis.Build.byRepositoryId @get('id'), event_type: 'push'
  ).property()

  pullRequests: (->
    Travis.Build.byRepositoryId @get('id'), event_type: 'pull_request'
  ).property()

  owner: (->
    (@get('slug') || @_id).split('/')[0]
  ).property('owner', 'name'),

  name: (->
    (@get('slug') || @_id).split('/')[1]
  ).property('owner', 'name'),

  last_build_duration: (->
    duration = @getPath('data.last_build_duration')
    duration = Travis.Helpers.durationFrom(@get('last_build_started_at'), @get('last_build_finished_at')) unless duration
    duration
  ).property('data.last_build_duration', 'last_build_started_at', 'last_build_finished_at')

  stats: (->
    # @get('_stats') || $.get("https://api.github.com/repos/#{@get('slug')}", (data) =>
    #   @set('_stats', data)
    #   @notifyPropertyChange 'stats'
    # ) && {}
  ).property('slug')

  select: ->
    Travis.Repository.select(self.get('id'))

  tick: ->
    @notifyPropertyChange 'last_build_duration'
    @notifyPropertyChange 'last_build_finished_at'

@Travis.Repository.reopenClass
  recent: ->
    @find()

  ownedBy: (owner) ->
    @find(owner: owner, orderBy: 'name')

  search: (query) ->
    @find(search: query, orderBy: 'name')

  bySlug: (slug) ->
    repo = $.detect(@find().toArray(), (repo) -> repo.get('slug') == slug)
    if repo then Ember.ArrayProxy.create(content: [repo]) else @find(slug: slug)

  select: (id) ->
    @find().forEach (repository) ->
      repository.set 'selected', repository.get('id') is id

  buildURL: (slug) ->
    if slug then slug else 'repositories'


