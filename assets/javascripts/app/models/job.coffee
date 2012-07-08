require 'travis/model'

@Travis.Job = Travis.Model.extend
  repositoryId:   DS.attr('number')
  commitId:       DS.attr('number')
  buildId:        DS.attr('number')
  logId:          DS.attr('number')
  queue:          DS.attr('string')
  state:          DS.attr('string')
  number:         DS.attr('string')
  result:         DS.attr('number')
  duration:       DS.attr('number')
  started_at:     DS.attr('string')
  finished_at:    DS.attr('string')
  allow_failure:  DS.attr('boolean')

  repository: DS.belongsTo('Travis.Repository')
  commit:     DS.belongsTo('Travis.Commit')
  build:      DS.belongsTo('Travis.Build')
  log:        DS.belongsTo('Travis.Artifact')

  config: (->
    @getPath 'data.config'
  ).property('data.config')

  sponsor: (->
    @getPath('data.sponsor')
  ).property('data.sponsor')

  configValues: (->
    config = @get('config')
    return [] unless config
    $.values($.only(config, 'rvm', 'gemfile', 'env', 'otp_release', 'php', 'node_js', 'scala', 'jdk', 'python', 'perl'))
  ).property('config')

  appendLog: (log) ->
    @set 'log', @get('log') + log

  subscribe: ->
    Travis.app.subscribe 'job-' + @get('id')

  onStateChange: (->
    Travis.app.unsubscribe 'job-' + @get('id') if @get('state') == 'finished'
  ).observes('state')

  tick: ->
    @notifyPropertyChange 'duration'
    @notifyPropertyChange 'finished_at'

@Travis.Job.reopenClass
  queued: (queue) ->
    @find()
    Travis.app.store.filter this, (job) -> job.get('queue') == 'builds.' + queue

  findMany: (ids) ->
    Travis.app.store.findMany this, ids

