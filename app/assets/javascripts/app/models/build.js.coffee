@Travis.Build = Travis.Model.extend
  state:           DS.attr('string')
  number:          DS.attr('number')
  branch:          DS.attr('string')
  message:         DS.attr('string')
  result:          DS.attr('number')
  duration:        DS.attr('number')
  started_at:      DS.attr('string')
  finished_at:     DS.attr('string')
  committed_at:    DS.attr('string')
  committer_name:  DS.attr('string')
  committer_email: DS.attr('string')
  author_name:     DS.attr('string')
  author_email:    DS.attr('string')
  compare_url:     DS.attr('string')

  repository: DS.belongsTo('Travis.Repository')
  commit:     DS.belongsTo('Travis.Commit')
  # jobs:       DS.hasMany('Travis.Job')

  config: (->
    @getPath 'data.config'
  ).property('data.config')

  isMatrix: (->
    @getPath('data.job_ids.length') > 1
  ).property('data.job_ids.length')

  isFailureMatrix: (->
    @getPath('allowedFailureJobs.length') > 0
  ).property('allowedFailureJobs.length')

  # TODO why does the hasMany association not work?
  jobs: (->
    Travis.Job.findMany(@getPath('data.job_ids'))
  ).property('data.job_ids.length')

  requiredJobs: (->
    @get('jobs').filter (job) -> job.get('allow_failure') != true
  ).property('jobs')

  allowedFailureJobs: (->
    @get('jobs').filter (job) -> job.get 'allow_failure'
  ).property('jobs')

  configKeys: (->
    config = @get('config')
    return [] unless config
    keys = $.keys($.only(config, 'rvm', 'gemfile', 'env', 'otp_release', 'php', 'node_js', 'perl', 'python', 'scala'))
    headers = [I18n.t('build.job'), I18n.t('build.duration'), I18n.t('build.finished_at')]
    $.map(headers.concat(keys), (key) -> return $.camelize(key))
  ).property('config')

  tick: ->
    @notifyPropertyChange 'duration'
    @notifyPropertyChange 'finished_at'

@Travis.Build.reopenClass
  byRepositoryId: (id, parameters) ->
    @find($.extend(parameters || {}, repository_id: id, orderBy: 'number DESC'))

  olderThanNumber: (id, build_number) ->
    @find(url: '/repositories/' + id + '/builds.json?bare=true&after_number=' + build_number, repository_id: id, orderBy: 'number DESC')

@Travis.Build.FIXTURES = [
  { id: 1, repository_id: 1, commit_id: 1, job_ids: [1, 2], number: 1, event_type: 'push', config: { rvm: ['rbx', '1.9.3'] }, finished_at: '2012-06-20T00:21:20Z', duration: 35, result: 0 },
  { id: 2, repository_id: 1, commit_id: 2, job_ids: [1], number: 2, event_type: 'push' },
  { id: 3, repository_id: 2, commit_id: 3, job_ids: [2], number: 3, event_type: 'push' },
  { id: 4, repository_id: 3, commit_id: 4, job_ids: [3], number: 4, event_type: 'push' }
]
