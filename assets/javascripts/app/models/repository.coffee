require 'travis/model'

@Travis.Repository = Travis.Model.extend
  slug:                DS.attr('string')
  owner:               DS.attr('string')
  name:                DS.attr('string')
  description:         DS.attr('string')
  lastBuildId:         DS.attr('number')
  lastBuildNumber:     DS.attr('string')
  lastBuildResult:     DS.attr('number')
  lastBuildStartedAt:  DS.attr('string')
  lastBuildFinishedAt: DS.attr('string')

  lastBuild: DS.belongsTo('Travis.Build')

  builds: (->
    Travis.Build.byRepositoryId @get('id'), event_type: 'push'
  ).property()

  pullRequests: (->
    Travis.Build.byRepositoryId @get('id'), event_type: 'pull_request'
  ).property()

  lastBuildDuration: (->
    duration = @getPath('data.last_build_duration')
    duration = Travis.Helpers.durationFrom(@get('lastBuildStartedAt'), @get('lastBuildFinishedAt')) unless duration
    duration
  ).property('data.last_build_duration', 'lastBuildStartedAt', 'lastBuildFinishedAt')

  sortOrder: (->
    @get('lastBuildFinishedAt') || '9999'
  ).property('lastBuildFinishedAt')

  stats: (->
    # @get('_stats') || $.get("https://api.github.com/repos/#{@get('slug')}", (data) =>
    #   @set('_stats', data)
    #   @notifyPropertyChange 'stats'
    # ) && {}
  ).property('slug')

  select: ->
    Travis.Repository.select(self.get('id'))

  tick: ->
    @notifyPropertyChange 'lastBuildDuration'
    @notifyPropertyChange 'lastBuildFinishedAt'

@Travis.Repository.reopenClass
  recent: ->
    @find()

  ownedBy: (owner) ->
    @find(owner: owner, orderBy: 'name')

  search: (query) ->
    @find(search: query, orderBy: 'name')

  bySlug: (slug) ->
    # TODO use filter?
    repo = $.detect(@find().toArray(), (repo) -> repo.get('slug') == slug)
    if repo then Ember.ArrayProxy.create(content: [repo]) else @find(slug: slug)

  select: (id) ->
    @find().forEach (repository) ->
      repository.set 'selected', repository.get('id') is id

  buildURL: (slug) ->
    if slug then slug else 'repositories'


