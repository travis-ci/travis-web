@Travis.Job = Travis.Model.extend
  repository_id:   DS.attr('number')
  build_id:        DS.attr('number')
  log_id:          DS.attr('number')
  queue:           DS.attr('string')
  state:           DS.attr('string')
  number:          DS.attr('string')
  result:          DS.attr('number')
  duration:        DS.attr('number')
  started_at:      DS.attr('string')
  finished_at:     DS.attr('string')
  allow_failure:   DS.attr('boolean')

  repository: DS.belongsTo('Travis.Repository')
  commit: DS.belongsTo('Travis.Commit')
  build: DS.belongsTo('Travis.Build')
  log: DS.belongsTo('Travis.Artifact')

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
    @all()
    Travis.store.filter this, (job) -> job.get('queue') == 'builds.' + queue
  findMany: (ids) ->
    Travis.store.findMany this, ids

@Travis.Job.FIXTURES = [
  { id: 1, repository_id: 1, build_id: 1, log_id: 1, number: '1.1', config: { rvm: 'rbx' }, finished_at: '2012-06-20T00:21:20Z', duration: 35, result: 0 }
  { id: 2, repository_id: 1, build_id: 1, log_id: 2, number: '1.2', config: { rvm: '1.9.3' } }
  { id: 3, repository_id: 1, build_id: 2, log_id: 3, number: '2.1' }
  { id: 4, repository_id: 2, build_id: 3, log_id: 4, number: '3.1' }
  { id: 5, repository_id: 3, build_id: 5, log_id: 5, number: '4.1' }
]

