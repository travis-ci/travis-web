`import { durationFrom, configKeys, compact } from 'travis/utils/helpers'`
`import configKeysMap from 'travis/utils/keys-map'`
`import Ember from 'ember'`
`import Model from 'travis/models/model'`
`import Log from 'travis/models/log'`
`import DurationCalculations from 'travis/utils/duration-calculations'`

Job = Model.extend DurationCalculations,
  ajax: Ember.inject.service()
  logId:          DS.attr()

  queue:          DS.attr()
  state:          DS.attr()
  number:         DS.attr()
  _startedAt:     DS.attr()
  _finishedAt:    DS.attr()
  allowFailure:   DS.attr('boolean')
  tags:           DS.attr()

  repositoryPrivate: DS.attr()

  repositorySlug: DS.attr()
  repo:   DS.belongsTo('repo', async: true)
  build:  DS.belongsTo('build', async: true)
  commit: DS.belongsTo('commit', async: true)

  annotations: DS.hasMany('annotation')

  _config: DS.attr('object')

  log: ( ->
    @set('isLogAccessed', true)
    Log.create(job: this, ajax: @get('ajax'))
  ).property()

  startedAt: (->
    unless @get('notStarted')
      @get('_startedAt')
  ).property('_startedAt', 'notStarted')

  finishedAt: (->
    unless @get('notStarted')
      @get('_finishedAt')
  ).property('_finishedAt', 'notStarted')

  repoSlug: (->
    @get('repositorySlug')
  ).property('repositorySlug')

  config: (->
    if config = @get('_config')
      compact(config)
    else if @get('currentState.stateName') != 'root.loading'
      return if @get('isFetchingConfig')
      @set 'isFetchingConfig', true

      @reload()
  ).property('_config')

  isFinished: (->
    @get('state') in ['passed', 'failed', 'errored', 'canceled']
  ).property('state')

  notStarted: (->
    @get('state') in ['queued', 'created', 'received']
  ).property('state')

  clearLog: ->
    # This is needed if we don't want to fetch log just to clear it
    if @get('isLogAccessed')
      @get('log').clear()

  sponsor: (->
    {
      name: "Blue Box"
      url: "http://bluebox.net"
    }
  ).property()

  configValues: (->
    config = @get('config')
    keys   = @get('build.rawConfigKeys')

    if config && keys
      keys.map (key) -> config[key]
    else
      []
  ).property('config', 'build.rawConfigKeys.length')

  canCancel: (->
    !@get('isFinished')
  ).property('state')

  canRestart: Ember.computed.alias('isFinished')

  cancel: (->
    @get('ajax').post "/jobs/#{@get('id')}/cancel"
  )

  removeLog: ->
    @get('ajax').patch("/jobs/#{@get('id')}/log").then =>
      @reloadLog()

  reloadLog: ->
    @clearLog()
    @get('log').fetch()

  restart: ->
    @get('ajax').post "/jobs/#{@get('id')}/restart"

  appendLog: (part) ->
    @get('log').append part

  subscribe: ->
    return if @get('subscribed')
    @set('subscribed', true)
    if Travis.pusher
      Travis.pusher.subscribe "job-#{@get('id')}"

  unsubscribe: ->
    return unless @get('subscribed')
    @set('subscribed', false)
    if Travis.pusher
      Travis.pusher.unsubscribe "job-#{@get('id')}"

  onStateChange: (->
    @unsubscribe() if @get('state') == 'finished' && Travis.pusher
  ).observes('state')

  # TODO: such formattings should be done in controller, but in order
  #       to use it there easily, I would have to refactor job and build
  #       controllers
  formattedFinishedAt: (->
    if finishedAt = @get('finishedAt')
      moment(finishedAt).format('lll')
  ).property('finishedAt')

  canRemoveLog: (->
    !@get('log.removed')
  ).property('log.removed')

  slug: (->
    "#{@get('repo.slug')} ##{@get('number')}"
  ).property()

  isLegacyInfrastructure: (->
    if @get('queue') == 'builds.linux'
      true
  ).property('queue')

`export default Job`
