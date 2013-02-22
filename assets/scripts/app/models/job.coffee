require 'travis/model'

@Travis.Job = Travis.Model.extend Travis.DurationCalculations,
  repoId:         DS.attr('number')
  buildId:        DS.attr('number')
  commitId:       DS.attr('number')
  logId:          DS.attr('number')

  queue:          DS.attr('string')
  state:          DS.attr('string')
  number:         DS.attr('string')
  startedAt:      DS.attr('string')
  finishedAt:     DS.attr('string')
  allowFailure:   DS.attr('boolean')

  repositorySlug: DS.attr('string')
  repo:   DS.belongsTo('Travis.Repo')
  build:  DS.belongsTo('Travis.Build')
  commit: DS.belongsTo('Travis.Commit')
  commits: DS.belongsTo('Travis.Commit')

  log: ( ->
    Travis.Log.create(job: this)
  ).property()

  repoSlug: (->
    @get('repo.slug') || @get('repositorySlug')
  ).property('repo.slug', 'repositorySlug')

  repoData: (->
    { id: @get('repoId'), slug: @get('repoSlug') }
  ).property('repoSlug', 'repoId')

  config: (->
    Travis.Helpers.compact(@get('data.config'))
  ).property('data.config')

  isFinished: (->
    @get('state') in ['passed', 'failed', 'errored', 'canceled']
  ).property('state')

  clearLog: ->
    @get('log').clear()

  sponsor: (->
    worker = @get('log.workerName')
    if worker && worker.length
      Travis.WORKERS[worker] || {
        name: "Travis Pro"
        url: "http://travis-ci.com"
      }
  ).property('log.workerName')

  configValues: (->
    config      = @get('config')
    buildConfig = @get('build.config')
    if config && buildConfig
      keys = $.intersect($.keys(buildConfig), Travis.CONFIG_KEYS)
      keys.map (key) -> config[key]
    else
      []
  ).property('config')

  canCancel: (->
    @get('state') == 'created' || @get('state') == 'queued' # TODO
  ).property('state')

  cancel: (->
    Travis.ajax.post "/jobs/#{@get('id')}", _method: 'delete'
  )

  requeue: ->
    Travis.ajax.post '/requests', job_id: @get('id')

  appendLog: (part) ->
    @get('log').append part

  subscribe: ->
    return if @get('subscribed')
    @set('subscribed', true)
    Travis.pusher.subscribe "job-#{@get('id')}"

  onStateChange: (->
    if @get('state') == 'finished' && Travis.pusher
      Travis.pusher.unsubscribe "job-#{@get('id')}"
  ).observes('state')

  isAttributeLoaded: (key) ->
    if ['finishedAt'].contains(key) && !@get('isFinished')
      return true
    else if key == 'startedAt' && @get('state') == 'created'
      return true
    else
      @_super(key)

  isFinished: (->
    @get('state') in ['passed', 'failed', 'errored', 'canceled']
  ).property('state')

@Travis.Job.reopenClass
  queued: (queue) ->
    @find()
    Travis.store.filter this, (job) ->
      queued = ['created', 'queued'].indexOf(job.get('state')) != -1
      # TODO: why queue is sometimes just common instead of build.common?
      queued && (!queue || job.get('queue') == "builds.#{queue}" || job.get('queue') == queue)

  running: ->
    @find(state: 'started')
    Travis.store.filter this, (job) ->
      job.get('state') == 'started'

  findMany: (ids) ->
    Travis.store.findMany this, ids

