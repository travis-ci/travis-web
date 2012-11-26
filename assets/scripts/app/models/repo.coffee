require 'travis/expandable_record_array'
require 'travis/model'

@Travis.Repo = Travis.Model.extend
  slug:                DS.attr('string')
  description:         DS.attr('string')
  lastBuildId:         DS.attr('number')
  lastBuildNumber:     DS.attr('string')
  lastBuildState:      DS.attr('string')
  lastBuildStartedAt:  DS.attr('string')
  lastBuildFinishedAt: DS.attr('string')

  lastBuild: DS.belongsTo('Travis.Build')

  allBuilds: (->
    allBuilds = DS.RecordArray.create
      type: Travis.Build
      content: Ember.A([])
      store: @get('store')
    @get('store').registerRecordArray(allBuilds, Travis.Build);
    allBuilds
  ).property()

  builds: (->
    id = @get('id')
    builds = Travis.Build.byRepoId id, event_type: 'push'
    array  = Travis.ExpandableRecordArray.create
      type: Travis.Build
      content: Ember.A([])
      store: @get('store')

    array.load(builds)

    id = @get('id')
    array.observe(@get('allBuilds'), (build) -> build.get('repo.id') == id && !build.get('isPullRequest') )

    array
  ).property()

  pullRequests: (->
    id = @get('id')
    builds = Travis.Build.byRepoId id, event_type: 'pull_request'
    array  = Travis.ExpandableRecordArray.create
      type: Travis.Build
      content: Ember.A([])
      store: @get('store')

    array.load(builds)

    id = @get('id')
    array.observe(@get('allBuilds'), (build) -> @get('repositoryId') == id && build.get('isPullRequest') )

    array
  ).property()

  branches: (->
    Travis.Branch.byRepoId @get('id')
  ).property()

  events: (->
    Travis.Event.byRepoId @get('id')
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
    if @get('slug')
      @get('_stats') || $.get("https://api.github.com/repos/#{@get('slug')}", (data) =>
        @set('_stats', data)
        @notifyPropertyChange 'stats'
      ) && {}
  ).property('slug')

  updateTimes: ->
    @notifyPropertyChange 'lastBuildDuration'

  regenerateKey: (options) ->
    Travis.ajax.ajax '/repos/' + @get('id') + '/key', 'post', options

@Travis.Repo.reopenClass
  recent: ->
    @find()

  ownedBy: (login) ->
    @find(owner_name: login, orderBy: 'name')

  accessibleBy: (login) ->
    @find(member: login, orderBy: 'name')

  search: (query) ->
    @find(search: query, orderBy: 'name')

  bySlug: (slug) ->
    repo = $.select(@find().toArray(), (repo) -> repo.get('slug') == slug)
    if repo.length > 0 then repo else @find(slug: slug)

  # buildURL: (slug) ->
  #   if slug then slug else 'repos'


