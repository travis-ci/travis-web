`import ExpandableRecordArray from 'travis/utils/expandable-record-array'`
`import Model from 'travis/models/model'`
# TODO: Investigate for some weird reason if I use durationFrom here not durationFromHelper,
#       the function stops being visible inside computed properties.
`import { durationFrom as durationFromHelper } from 'travis/utils/helpers'`
`import Build from 'travis/models/build'`
`import Config from 'travis/config/environment'`

Repo = null

if Config.useV3API
  Repo = Model.extend
    defaultBranch: DS.belongsTo('branch', async: false)

    lastBuild: Ember.computed.oneWay('defaultBranch.lastBuild')

    lastBuildFinishedAt: Ember.computed.oneWay('lastBuild.finishedAt')
    lastBuildId: Ember.computed.oneWay('lastBuild.id')
    lastBuildState: Ember.computed.oneWay('lastBuild.state')
    lastBuildNumber: Ember.computed.oneWay('lastBuild.number')
    lastBuildStartedAt: Ember.computed.oneWay('lastBuild.startedAt')
    lastBuildDuration: Ember.computed.oneWay('lastBuild.duration')


else
  Repo = Model.extend
    lastBuildNumber:     DS.attr('number')
    lastBuildState:      DS.attr()
    lastBuildStartedAt:  DS.attr()
    lastBuildFinishedAt: DS.attr()
    _lastBuildDuration:  DS.attr('number')
    lastBuildLanguage:   DS.attr()
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
        @store.findRecord('build', id)
        @store.recordForId('build', id)
    ).property('lastBuildId')

    lastBuildDuration: (->
      duration = @get('_lastBuildDuration')
      duration = durationFromHelper(@get('lastBuildStartedAt'), @get('lastBuildFinishedAt')) unless duration
      duration
    ).property('_lastBuildDuration', 'lastBuildStartedAt', 'lastBuildFinishedAt')

Repo.reopen
  ajax: Ember.inject.service()

  slug:                DS.attr()
  description:         DS.attr()
  private:             DS.attr('boolean')
  githubLanguage:      DS.attr()
  active:              DS.attr()

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
      b.get('repo.id')+'' == id+'' && (b.get('eventType') == 'push' || b.get('eventType') == 'api')
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
      b.get('repo.id')+'' == id+'' && b.get('eventType') == 'pull_request'
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

  sortOrderForLandingPage: (->
    state = @get('lastBuildState')
    if state != 'passed' && state != 'failed'
      0
    else
      parseInt(@get('lastBuildId'))
  ).property('lastBuildId', 'lastBuildState')

  stats: (->
    if @get('slug')
      @get('_stats') || $.get("https://api.github.com/repos/#{@get('slug')}", (data) =>
        @set('_stats', data)
        @notifyPropertyChange 'stats'
      ) && {}
  ).property('slug')

  updateTimes: ->
    if Config.useV3API
      if lastBuild = @get('lastBuild')
        lastBuild.updateTimes()
    else
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

  accessibleBy: (store, reposIdsOrlogin) ->
    if Config.useV3API
      reposIds = reposIdsOrlogin
      # this fires only for authenticated users and with API v3 that means getting
      # only repos of currently logged in owner, but in the future it would be
      # nice to not use that as it may change in the future
      repos = store.filter('repo', (repo) ->
        reposIds.indexOf(parseInt(repo.get('id'))) != -1
      )

      promise = new Ember.RSVP.Promise (resolve, reject) ->
        store.query('repo', { 'repository.active': 'true', limit: 20 }).then( ->
          resolve(repos)
        , ->
          reject()
        )

      promise
    else
      login = reposIdsOrlogin
      store.find('repo', { member: login, orderBy: 'name' })

  search: (store, ajax, query) ->
    if Config.useV3API
      queryString = $.param(search: query, orderBy: 'name', limit: 5)
      promise = ajax.ajax("/repos?#{queryString}", 'get')
      result = Ember.ArrayProxy.create(content: [])

      promise.then (data, status, xhr) ->
        promises = data.repos.map (repoData) ->
          store.findRecord('repo', repoData.id).then (record) ->
            result.pushObject(record)
            result.set('isLoaded', true)
            record

        Ember.RSVP.allSettled(promises).then ->
          result
    else
      store.find('repo', search: query, orderBy: 'name')

  withLastBuild: (store) ->
    repos = store.filter('repo', {}, (build) ->
      build.get('lastBuildId')
    )

    repos.then () ->
      repos.set('isLoaded', true)

    repos

  fetchBySlug: (store, slug) ->
    repos = store.peekAll('repo').filterBy('slug', slug)
    if repos.get('length') > 0
      repos.get('firstObject')
    else
      promise = null

      if Config.useV3API
        adapter = store.adapterFor('repo')
        modelClass = store.modelFor('repo')

        promise = adapter.findRecord(store, modelClass, slug).then (payload) ->
          serializer = store.serializerFor('repo')
          modelClass = store.modelFor('repo')
          result = serializer.normalizeResponse(store, modelClass, payload, null, 'findRecord')

          repo = store.push(data: result.data)
          for record in result.included
            r = store.push(data: record)

          repo

      else
        promise = store.find('repo', { slug: slug }).then (repos) ->
          repos.get('firstObject') || throw("no repos found")

      promise.catch ->
        error = new Error('repo not found')
        error.slug = slug
        throw(error)

  # buildURL: (slug) ->
  #   if slug then slug else 'repos'

`export default Repo`
