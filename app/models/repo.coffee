`import ExpandableRecordArray from 'travis/utils/expandable-record-array'`
`import Model from 'travis/models/model'`
# TODO: Investigate for some weird reason if I use durationFrom here not durationFromHelper,
#       the function stops being visible inside computed properties.
`import { durationFrom as durationFromHelper } from 'travis/utils/helpers'`
`import Build from 'travis/models/build'`

Repo = Model.extend
  ajax: Ember.inject.service()

  slug:                DS.attr()
  description:         DS.attr()
  private:             DS.attr('boolean')
  githubLanguage:      DS.attr()
  active:              DS.attr()
  lastBuild: DS.belongsTo('build')

  withLastBuild: ->
    @filter( (repo) -> repo.get('lastBuild') )

  sshKey: (->
    @store.find('ssh_key', @get('id'))
    @store.recordForId('ssh_key', @get('id'))
  )

  envVars: (->
    id = @get('id')
    @store.filter('env_var', { repository_id: id }, (v) ->
      v.get('repo.id') == id
    )
  ).property()

  builds: (->
    id = @get('id')
    builds = @store.filter('build', event_type: ['push', 'api'], repository_id: id, (b) ->
      b.get('repo.id') == id && (b.get('eventType') == 'push' || b.get('eventType') == 'api')
    )

    # TODO: move to controller
    array  = ExpandableRecordArray.create
      type: 'build'
      content: Ember.A([])

    array.load(builds)
    array.observe(builds)

    array
  ).property()

  pullRequests: (->
    id = @get('id')
    builds = @store.filter('build', event_type: 'pull_request', repository_id: id, (b) ->
      b.get('repo.id') == id && b.get('eventType') == 'pull_request'
    )

    # TODO: move to controller
    array  = ExpandableRecordArray.create
      type: 'build'
      content: Ember.A([])

    array.load(builds)

    id = @get('id')
    array.observe(builds)

    array
  ).property()

  branches: (->
    builds = @store.query 'build', repository_id: @get('id'), branches: true

    builds.then ->
      builds.set 'isLoaded', true

    builds
  ).property()

  owner: (->
    (@get('slug') || '').split('/')[0]
  ).property('slug')

  name: (->
    (@get('slug') || '').split('/')[1]
  ).property('slug')

  lastBuildDuration: (->
    duration = @get('_lastBuildDuration')
    duration = durationFromHelper(@get('lastBuildStartedAt'), @get('lastBuildFinishedAt')) unless duration
    duration
  ).property('_lastBuildDuration', 'lastBuildStartedAt', 'lastBuildFinishedAt')

  sortOrderForLandingPage: (->
    state = @get('lastBuildState')
    if state != 'passed' && state != 'failed'
      0
    else
      parseInt(@get('lastBuildId'))
  ).property('lastBuildId', 'lastBuildState')

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
    @get('ajax').ajax '/repos/' + @get('id') + '/key', 'post', options

  fetchSettings: ->
    @get('ajax').ajax('/repos/' + @get('id') + '/settings', 'get', forceAuth: true).then (data) ->
      data['settings']

  saveSettings: (settings) ->
    @get('ajax').ajax('/repos/' + @get('id') + '/settings', 'patch', data: { settings: settings })

Repo.reopenClass
  recent: ->
    @find()

  accessibleBy: (store, login) ->
    # this fires only for authenticated users and with API v3 that means getting
    # only repos of currently logged in owner, but in the future it would be
    # nice to not use that as it may change in the future
    repos = store.query('repo', { 'repository.active': 'true' })

    repos.then () ->
      repos.set('isLoaded', true)

    repos

  search: (store, query) ->
    promise = store.query('repo', search: query, orderBy: 'name')
    result = Ember.ArrayProxy.create(content: [])

    promise.then ->
      result.pushObjects(promise.get('content').toArray())
      result.set('isLoaded', true)

    result

  withLastBuild: (store) ->
    repos = store.filter('repo', {}, (build) ->
      build.get('lastBuild')
    )

    repos.then () ->
      repos.set('isLoaded', true)

    repos

  fetchBySlug: (store, slug) ->
    repos = store.peekAll('repo').filterBy('slug', slug)
    if repos.get('length') > 0
      repos.get('firstObject')
    else
      adapter = store.adapterFor('repo')
      modelClass = store.modelFor('repo')
      adapter.findRecord(store, modelClass, slug).then (resourceHash) ->
        store.push(store.normalize('repo', resourceHash));
      , ->
        error = new Error('repo not found')
        error.slug = slug
        Ember.get(repos, 'firstObject') || throw(error)

  # buildURL: (slug) ->
  #   if slug then slug else 'repos'

`export default Repo`
