require 'travis/model'

@Travis.Job = Travis.Model.extend
  repositoryId:   DS.attr('number')
  buildId:        DS.attr('number')
  commitId:       DS.attr('number')
  logId:          DS.attr('number')

  queue:          DS.attr('string')
  state:          DS.attr('string')
  number:         DS.attr('string')
  result:         DS.attr('number')
  duration:       DS.attr('number')
  startedAt:      DS.attr('string')
  finishedAt:     DS.attr('string')
  allowFailure:   DS.attr('boolean', key: 'allow_failure')

  repository: DS.belongsTo('Travis.Repository', key: 'repository_id')
  build:      DS.belongsTo('Travis.Build',      key: 'build_id')
  commit:     DS.belongsTo('Travis.Commit',     key: 'commit_id')
  log:        DS.belongsTo('Travis.Artifact',   key: 'log_id')

  config: (->
    Travis.Helpers.compact(@get('data.config'))
  ).property('data.config')

  sponsor: (->
    @get('data.sponsor')
  ).property('data.sponsor')

  configValues: (->
    if config = @get('config')
      $.values($.only.apply(config, Travis.CONFIG_KEYS))
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

  tick: ->
    @notifyPropertyChange 'duration'
    @notifyPropertyChange 'finished_at'

@Travis.Job.reopenClass
  queued: (queue) ->
    @find()
    Travis.app.store.filter this, (job) -> job.get('queue') == queue

  findMany: (ids) ->
    Travis.app.store.findMany this, ids

