require 'travis/model'
require 'models/extensions'
require 'models/log'

DurationCalculations = Travis.DurationCalculations
Log = Travis.Log
compact = Travis.Helpers.compact

@Travis.Job = Travis.Model.extend DurationCalculations,
  logId:          DS.attr()

  queue:          DS.attr()
  state:          DS.attr()
  number:         DS.attr()
  _startedAt:     DS.attr()
  _finishedAt:    DS.attr()
  allowFailure:   DS.attr('boolean')

  repositorySlug: DS.attr()
  repo:   DS.belongsTo('repo', async: true)
  build:  DS.belongsTo('build', async: true)
  commit: DS.belongsTo('commit', async: true)

  annotations: DS.hasMany('annotation')

  _config: DS.attr('object')

  log: ( ->
    @set('isLogAccessed', true)
    Log.create(job: this)
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
    else
      return if @get('isFetchingConfig')
      @set 'isFetchingConfig', true

      @reload()
  ).property('_config')

  isFinished: (->
    @get('state') in ['passed', 'failed', 'errored', 'canceled']
  ).property('state')

  notStarted: (->
    @get('state') in ['queued', 'created']
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

  cancel: (->
    Ajax.post "/jobs/#{@get('id')}/cancel"
  )

  removeLog: ->
    Ajax.patch("/jobs/#{@get('id')}/log").then =>
      @reloadLog()

  reloadLog: ->
    @clearLog()
    @get('log').fetch()

  requeue: ->
    Ajax.post "/jobs/#{@get('id')}/restart"

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

  isFinished: (->
    @get('state') in ['passed', 'failed', 'errored', 'canceled']
  ).property('state')

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

@Travis.Job.reopenClass
  queued: ->
    filtered = Ember.FilteredRecordArray.create(
      modelClass: Travis.Job
      filterFunction: (job) ->
        ['created', 'queued'].indexOf(job.get('state')) != -1
      filterProperties: ['state', 'queue']
    )

    @fetch().then (array) ->
      filtered.updateFilter()
      filtered.set('isLoaded', true)

    filtered

  running: ->
    filtered = Ember.FilteredRecordArray.create(
      modelClass: Travis.Job
      filterFunction: (job) ->
        ['started', 'received'].indexOf(job.get('state')) != -1
      filterProperties: ['state']
    )

    @fetch(state: 'started').then (array) ->
      filtered.updateFilter()
      filtered.set('isLoaded', true)

    filtered


