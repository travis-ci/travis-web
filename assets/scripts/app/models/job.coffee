require 'travis/model'

@Travis.Job = Travis.Model.extend Travis.DurationCalculations,
  repoId:   DS.attr('number', key: 'repository_id')
  buildId:        DS.attr('number')
  commitId:       DS.attr('number')
  logId:          DS.attr('number')

  queue:          DS.attr('string')
  state:          DS.attr('string')
  number:         DS.attr('string')
  result:         DS.attr('number')
  startedAt:      DS.attr('string')
  finishedAt:     DS.attr('string')
  allowFailure:   DS.attr('boolean', key: 'allow_failure')

  repositorySlug: DS.attr('string')
  repo:   DS.belongsTo('Travis.Repo',     key: 'repository_id')
  build:  DS.belongsTo('Travis.Build',    key: 'build_id')
  commit: DS.belongsTo('Travis.Commit',   key: 'commit_id')
  log:    DS.belongsTo('Travis.Artifact', key: 'log_id')

  repoSlug: (->
    @get('repositorySlug')
  ).property('repositorySlug')

  repoData: (->
    { id: @get('repoId'), slug: @get('repoSlug') }
  ).property('repoSlug', 'repoId')

  config: (->
    Travis.Helpers.compact(@get('data.config'))
  ).property('data.config')

  isFinished: (->
    @get('state') == 'finished'
  ).property('state')

  clearLog: ->
    @get('log').clear() if @get('log.isLoaded')

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

  appendLog: (text) ->
    if log = @get('log')
      log.append(text)

  subscribe: ->
    if id = @get('id')
      Travis.app.pusher.subscribe "job-#{id}"

  onStateChange: (->
    if @get('state') == 'finished' && Travis.app
      Travis.app.pusher.unsubscribe "job-#{@get('id')}"
  ).observes('state')

  isAttributeLoaded: (key) ->
    if ['finishedAt', 'result'].contains(key) && !@get('finished')
      return true
    else if key == 'startedAt' && @get('state') == 'created'
      return true
    else
      @_super(key)

  finished: (->
    @get('state') == 'finished'
  ).property('state')

@Travis.Job.reopenClass
  queued: (queue) ->
    @find()
    Travis.app.store.filter this, (job) ->
      queued = ['created', 'queued'].indexOf(job.get('state')) != -1
      # TODO: why queue is sometimes just common instead of build.common?
      queued && (!queue || job.get('queue') == "builds.#{queue}" || job.get('queue') == queue)

  findMany: (ids) ->
    Travis.app.store.findMany this, ids

