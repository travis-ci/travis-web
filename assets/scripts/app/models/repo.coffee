require 'travis/expandable_record_array'
require 'travis/model'
require 'helpers/helpers'

EnvVar = Travis.EnvVar
Build  = Travis.Build
SshKey = Travis.SshKey
ExpandableRecordArray = Travis.ExpandableRecordArray
Event = Travis.Event
durationFrom = Travis.Helpers.durationFrom
Ajax = Travis.ajax

@Travis.Repo = Travis.Model.extend
  id:                  Ember.attr('string')
  slug:                Ember.attr('string')
  description:         Ember.attr('string')
  private:             Ember.attr('boolean')
  lastBuildId:         Ember.attr('string')
  lastBuildNumber:     Ember.attr(Number)
  lastBuildState:      Ember.attr('string')
  lastBuildStartedAt:  Ember.attr('string')
  lastBuildFinishedAt: Ember.attr('string')
  githubLanguage:      Ember.attr('string')
  _lastBuildDuration:  Ember.attr(Number, key: 'last_build_duration')

  lastBuild: Ember.belongsTo('Travis.Build', key: 'last_build_id')

  lastBuildHash: (->
    {
      id: @get('lastBuildId')
      number: @get('lastBuildNumber')
      repo: this
    }
  ).property('lastBuildId', 'lastBuildNumber')

  withLastBuild: ->
    @filter( (repo) -> repo.get('lastBuildId') )

  sshKey: (->
    SshKey.find(@get('id'))
  )

  envVars: (->
    id = @get('id')
    envVars = EnvVar.find repository_id: id

    # TODO: move to controller
    array  = ExpandableRecordArray.create
      type: EnvVar
      content: Ember.A([])

    array.load(envVars)

    globalEnvVars = Ember.RecordArray.create({ modelClass: EnvVar, content: Ember.A([]) })
    EnvVar.registerRecordArray(globalEnvVars)

    array.observe(globalEnvVars, (envVar) -> envVar.get('isLoaded') && envVar.get('repo.id') == id )

    array
  ).property()

  allBuilds: (->
    recordArray = Ember.RecordArray.create({ modelClass: Build, content: Ember.A([]) })
    Build.registerRecordArray(recordArray)
    recordArray
  ).property()

  builds: (->
    id = @get('id')
    builds = Build.byRepoId id, event_type: 'push'

    # TODO: move to controller
    array  = ExpandableRecordArray.create
      type: Build
      content: Ember.A([])

    array.load(builds)

    id = @get('id')
    array.observe(@get('allBuilds'), (build) -> build.get('isLoaded') && build.get('repo.id') == id && !build.get('isPullRequest') )

    array
  ).property()

  pullRequests: (->
    id = @get('id')
    builds = Build.byRepoId id, event_type: 'pull_request'
    array  = ExpandableRecordArray.create
      type: Build
      content: Ember.A([])

    array.load(builds)

    id = @get('id')
    array.observe(@get('allBuilds'), (build) -> build.get('isLoaded') && build.get('repo.id') == id && build.get('isPullRequest') )

    array
  ).property()

  branches: (->
    Build.branches repoId: @get('id')
  ).property()

  events: (->
    Event.byRepoId @get('id')
  ).property()

  owner: (->
    (@get('slug') || '').split('/')[0]
  ).property('slug')

  name: (->
    (@get('slug') || '').split('/')[1]
  ).property('slug')

  lastBuildDuration: (->
    duration = @get('_lastBuildDuration')
    duration = durationFrom(@get('lastBuildStartedAt'), @get('lastBuildFinishedAt')) unless duration
    duration
  ).property('_lastBuildDuration', 'lastBuildStartedAt', 'lastBuildFinishedAt')

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
    Ajax.ajax '/repos/' + @get('id') + '/key', 'post', options

  fetchSettings: ->
    Ajax.ajax('/repos/' + @get('id') + '/settings', 'get', forceAuth: true).then (data) ->
      data['settings']

  saveSettings: (settings) ->
    Ajax.ajax('/repos/' + @get('id') + '/settings', 'patch', data: { settings: settings })

Travis.Repo.reopenClass
  recent: ->
    @find()

  ownedBy: (login) ->
    @find(owner_name: login, orderBy: 'name')

  accessibleBy: (login) ->
    @find(member: login, orderBy: 'name')

  search: (query) ->
    @find(search: query, orderBy: 'name')

  withLastBuild: ->
    filtered = Ember.FilteredRecordArray.create(
      modelClass: this
      filterFunction: (repo) -> repo.get('lastBuildId')
      filterProperties: ['lastBuildId']
    )

    @fetch().then (array) ->
      filtered.updateFilter()
      filtered.set('isLoaded', true)

    filtered

  bySlug: (slug) ->
    repo = $.select(@find().toArray(), (repo) -> repo.get('slug') == slug)
    if repo.length > 0 then repo else @find(slug: slug)

  fetchBySlug: (slug) ->
    repos = $.select(@find().toArray(), (repo) -> repo.get('slug') == slug)
    if repos.length > 0
      repos[0]
    else
      @fetch(slug: slug).then (repos) ->
        error = new Error('repo not found')
        error.slug = slug
        Ember.get(repos, 'firstObject') || throw(error)

  # buildURL: (slug) ->
  #   if slug then slug else 'repos'
