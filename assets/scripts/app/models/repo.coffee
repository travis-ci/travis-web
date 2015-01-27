require 'travis/expandable_record_array'
require 'travis/model'
require 'helpers/helpers'

EnvVar = Travis.EnvVar
Build  = Travis.Build
SshKey = Travis.SshKey
Event = Travis.Event
durationFrom = Travis.Helpers.durationFrom
Ajax = Travis.ajax

Travis.Repo = Travis.Model.extend
  slug:                DS.attr()
  description:         DS.attr()
  private:             DS.attr('boolean')
  lastBuildNumber:     DS.attr('number')
  lastBuildState:      DS.attr()
  lastBuildStartedAt:  DS.attr()
  lastBuildFinishedAt: DS.attr()
  githubLanguage:      DS.attr()
  _lastBuildDuration:  DS.attr('number')
  lastBuildLanguage:   DS.attr()
  active:              DS.attr()
  lastBuildId:         DS.attr('number')
  lastBuildHash: (->
    {
      id: @get('lastBuildId')
      number: @get('lastBuildNumber')
      repo: this
    }
  ).property('lastBuildId', 'lastBuildNumber')

  lastBuild: (->
    @store.find('build', @get('lastBuildId'))
  ).property('lastBuildId')

  withLastBuild: ->
    @filter( (repo) -> repo.get('lastBuildId') )

  sshKey: (->
    SshKey.find(@get('id'))
  )

  envVars: (->
    id = @get('id')
    envVars = @store.filter('env_var', { repository_id: id }, (envVar) ->
#      envVar.get('
    )

    EnvVar.find repository_id: id

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

  accessibleBy: (store, login) ->
    repos = store.find('repo', { member: login, orderBy: 'name' })

    repos.then () ->
      repos.set('isLoaded', true)

    repos

  search: (store, query) ->
    store.find('repo', search: query, orderBy: 'name')

  withLastBuild: (store) ->
    repos = store.filter('repo', {}, (build) ->
      build.get('lastBuildId')
    )

    repos.then () ->
      repos.set('isLoaded', true)

    repos

  bySlug: (store, slug) ->
    # first check if there is a repo with a given slug already ordered
    repos = store.all('repo').filterBy('slug', slug)
    if repos.get('length') > 0
      repos
    else
      store.find('repo', { slug: slug })

  fetchBySlug: (store, slug) ->
    repos = @bySlug(store, slug)
    if repos.get('length') > 0
      repos.get('firstObject')
    else
      repos.then (repos) ->
        error = new Error('repo not found')
        error.slug = slug
        Ember.get(repos, 'firstObject') || throw(error)

  # buildURL: (slug) ->
  #   if slug then slug else 'repos'
