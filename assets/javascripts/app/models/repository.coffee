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
    id = @get('id')
    Travis.Build.byRepositoryId id, event_type: 'push'
    Travis.Build.filter (data) -> parseInt(data.get('repository_id')) == id && data.get('pull_request') == false
  ).property()

  pullRequests: (->
    id = @get('id')
    Travis.Build.byRepositoryId id, event_type: 'pull_request'
    Travis.Build.filter (data) -> parseInt(data.get('repository_id')) == id && data.get('pull_request') == true
  ).property()

  branches: (->
    Travis.Branch.byRepositoryId @get('id')
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
    @find(slug: slug)

  select: (id) ->
    @find().forEach (repository) ->
      repository.set 'selected', repository.get('id') is id

  # buildURL: (slug) ->
  #   if slug then slug else 'repositories'


