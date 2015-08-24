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
    if id = @get('lastBuildId')
      @store.find('build', id)
      @store.recordForId('build', id)
  ).property('lastBuildId')

  withLastBuild: ->
    @filter( (repo) -> repo.get('lastBuildId') )

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
    repos = store.query('repo', { member: login, orderBy: 'name' })

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
      build.get('lastBuildId')
    )

    repos.then () ->
      repos.set('isLoaded', true)

    repos

  bySlug: (store, slug) ->
    # first check if there is a repo with a given slug already ordered
    repos = store.peekAll('repo').filterBy('slug', slug)
    if repos.get('length') > 0
      repos
    else
      store.query('repo', { slug: slug })

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

`export default Repo`
