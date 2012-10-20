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
  _duration:      DS.attr('number', key: 'duration')
  startedAt:      DS.attr('string')
  finishedAt:     DS.attr('string')
  allowFailure:   DS.attr('boolean', key: 'allow_failure')

  repo: DS.belongsTo('Travis.Repo', key: 'repository_id')
  build:      DS.belongsTo('Travis.Build',      key: 'build_id')
  commit:     DS.belongsTo('Travis.Commit',     key: 'commit_id')
  log:        DS.belongsTo('Travis.Artifact',   key: 'log_id')

  config: (->
    Travis.Helpers.compact(@get('data.config'))
  ).property('data.config')

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

  appendLog: (text) ->
    if log = @get('log')
      log.append(text)

  subscribe: ->
    if id = @get('id')
      Travis.app.pusher.subscribe "job-#{id}"

  onStateChange: (->
    Travis.app.pusher.unsubscribe "job-#{@get('id')}" if @get('state') == 'finished'
  ).observes('state')

@Travis.Job.reopenClass
  queued: (queue) ->
    @find()
    Travis.app.store.filter this, (job) ->
      queued = ['created', 'queued'].indexOf(job.get('state')) != -1
      queued && (!queue || job.get('queue') == "builds.#{queue}")

  findMany: (ids) ->
    Travis.app.store.findMany this, ids

