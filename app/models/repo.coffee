`import ExpandableRecordArray from 'travis/utils/expandable-record-array'`
`import Model from 'travis/models/model'`
`import Ajax from 'travis/utils/ajax'`
# TODO: Investigate for some weird reason if I use durationFrom here not durationFromHelper,
#       the function stops being visible inside computed properties.
`import { durationFrom as durationFromHelper } from 'travis/utils/helpers'`
`import Build from 'travis/models/build'`

Repo = Model.extend
  slug:                DS.attr()
  description:         DS.attr()
  private:             DS.attr('boolean')
  githubLanguage:      DS.attr()
  active:              DS.attr()

  lastBuild: DS.belongsTo('build', async: false)
  # For some reason belongsTo('repo') relationship doesn't load properly
  # without inverse
  _builds: DS.hasMany('build', inverse: 'repo', async: true)

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
    builds = @store.filter('build', event_type: 'push', repository_id: id, (b) ->
      b.get('repo.id') == id && b.get('eventType') == 'push'
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
    builds = @store.find 'build', repository_id: @get('id'), branches: true

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
    state = @get('lastBuild.state')
    if state != 'passed' && state != 'failed'
      0
    else
      parseInt(@get('lastBuild.id'))
  ).property('lastBuild.id', 'lastBuild.state')

  sortOrder: (->
    if lastBuildFinishedAt = @get('lastBuild.finishedAt')
      new Date(lastBuildFinishedAt).getTime()
    else
      - 999999999 + parseInt(@get('lastBuild.id'))
  ).property('lastBuild.finishedAt', 'lastBuild.id')

  stats: (->
    if @get('slug')
      @get('_stats') || $.get("https://api.github.com/repos/#{@get('slug')}", (data) =>
        @set('_stats', data)
        @notifyPropertyChange 'stats'
      ) && {}
  ).property('slug')

  updateTimes: ->
    if build = @get('lastBuild')
      build.notifyPropertyChange 'duration'

  regenerateKey: (options) ->
    Ajax.ajax '/repos/' + @get('id') + '/key', 'post', options

  fetchSettings: ->
    Ajax.ajax('/repos/' + @get('id') + '/settings', 'get', forceAuth: true).then (data) ->
      data['settings']

  saveSettings: (settings) ->
    Ajax.ajax('/repos/' + @get('id') + '/settings', 'patch', data: { settings: settings })

Repo.reopenClass
  recent: ->
    @find()

  accessibleBy: (store, login) ->
    repos = store.find('repo', { "repository.active": "true" })

    repos.then () ->
      repos.set('isLoaded', true)

    repos

  search: (store, query) ->
    promise = store.find('repo', search: query, orderBy: 'name')
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
    repos = store.all('repo').filterBy('slug', slug)
    if repos.get('length') > 0
      repos

  fetchBySlug: (store, slug) ->
    repos = @bySlug(store, slug)
    if repos
      repos.get('firstObject')
    else
      # TODO: is there a better way to fetch a record by slug
      #       without having a list endpoint filtered by slug?
      headers = {
        Accept: 'application/vnd.travis-ci.3+json'
      }
      Ajax.ajax("/repo/#{slug.split('/').join('%2F')}", 'GET', headers: headers).then (data) ->
        store.pushPayload 'repo', repositories: [data]
        store.recordForId 'repo', data.id
      , ->
        error = new Error('repo not found')
        error.slug = slug
        throw(error)

  # buildURL: (slug) ->
  #   if slug then slug else 'repos'

`export default Repo`
