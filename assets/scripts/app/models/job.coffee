require 'travis/model'

@Travis.Job = Travis.Model.extend Travis.DurationCalculations,
  repoId:         Ember.attr('string', key: 'repository_id')
  buildId:        Ember.attr('string')
  commitId:       Ember.attr('string')
  logId:          Ember.attr('string')

  queue:          Ember.attr('string')
  state:          Ember.attr('string')
  number:         Ember.attr('string')
  _startedAt:     Ember.attr('string', key: 'started_at')
  _finishedAt:    Ember.attr('string', key: 'finished_at')
  allowFailure:   Ember.attr('boolean')

  repositorySlug: Ember.attr('string')
  repo:   Ember.belongsTo('Travis.Repo', key: 'repository_id')
  build:  Ember.belongsTo('Travis.Build')
  commit: Ember.belongsTo('Travis.Commit')

  annotations: Ember.hasMany('Travis.Annotation')

  _config: Ember.attr('object', key: 'config')

  log: ( ->
    @set('isLogAccessed', true)
    Travis.Log.create(job: this)
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
    Travis.Helpers.compact(@get('_config'))
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
    Travis.ajax.post "/jobs/#{@get('id')}/cancel"
  )

  removeLog: ->
    Travis.ajax.patch("/jobs/#{@get('id')}/log").then =>
      @reloadLog()

  reloadLog: ->
    @clearLog()
    @get('log').fetch()

  requeue: ->
    Travis.ajax.post "/jobs/#{@get('id')}/restart"

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

  isPropertyLoaded: (key) ->
    if ['_finishedAt'].contains(key) && !@get('isFinished')
      return true
    else if key == '_startedAt' && @get('state') == 'created'
      return true
    else
      @_super(key)

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
    # This should somehow get the status of removed log, but unfortunately there is
    # no easy way to do that at the moment
    true
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
        job.get('state') == 'started'
      filterProperties: ['state']
    )

    @fetch(state: 'started').then (array) ->
      filtered.updateFilter()
      filtered.set('isLoaded', true)

    filtered


