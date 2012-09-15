require 'travis/model'

@Travis.Repository = Travis.Model.extend
  slug:                DS.attr('string')
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

  branches: (->
    Travis.Branch.byRepositoryId @get('id')
  ).property()

  owner: (->
    (@get('slug') || '').split('/')[0]
  ).property('slug')

  name: (->
    (@get('slug') || '').split('/')[1]
  ).property('slug')

  lastBuildDuration: (->
    duration = @get('data.last_build_duration')
    duration = Travis.Helpers.durationFrom(@get('lastBuildStartedAt'), @get('lastBuildFinishedAt')) unless duration
    duration
  ).property('data.last_build_duration', 'lastBuildStartedAt', 'lastBuildFinishedAt')

  sortOrder: (->
    # cuz sortAscending seems buggy when set to false
    if lastBuildFinishedAt = @get('lastBuildFinishedAt')
      - new Date(lastBuildFinishedAt).getTime()
    else
      - new Date('9999').getTime() - parseInt(@get('lastBuildId'))
  ).property('lastBuildFinishedAt', 'lastBuildId')

  stats: (->
    @get('_stats') || $.get("https://api.github.com/repos/#{@get('slug')}", (data) =>
      @set('_stats', data)
      @notifyPropertyChange 'stats'
    ) && {}
  ).property()

  select: ->
    Travis.Repository.select(@get('id'))

  updateTimes: ->
    @notifyPropertyChange 'lastBuildDuration'

@Travis.Repository.reopenClass
  recent: ->
    @find()

  ownedBy: (login) ->
    @find(owner_name: login, orderBy: 'name')

  search: (query) ->
    @find(search: query, orderBy: 'name')

  bySlug: (slug) ->
    repo = $.select(@find().toArray(), (repo) -> repo.get('slug') == slug)
    if repo.length > 0 then repo else @find(slug: slug)

  select: (id) ->
    @find().forEach (repository) ->
      repository.set('selected', repository.get('id') == id)

  # buildURL: (slug) ->
  #   if slug then slug else 'repositories'


