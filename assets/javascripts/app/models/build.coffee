require 'travis/model'

@Travis.Build = Travis.Model.extend Travis.DurationCalculations,
  eventType:       DS.attr('string')
  repositoryId:    DS.attr('number')
  commitId:        DS.attr('number')

  state:           DS.attr('string')
  number:          DS.attr('number')
  branch:          DS.attr('string')
  message:         DS.attr('string')
  result:          DS.attr('number')
  _duration:       DS.attr('number', key: 'duration')
  startedAt:       DS.attr('string', key: 'started_at')
  finishedAt:      DS.attr('string', key: 'finished_at')

  repository: DS.belongsTo('Travis.Repository')
  commit:     DS.belongsTo('Travis.Commit')
  jobs:       DS.hasMany('Travis.Job', key: 'job_ids')

  config: (->
    Travis.Helpers.compact(@get('data.config'))
  ).property('data.config')

  isMatrix: (->
    @get('data.job_ids.length') > 1
  ).property('data.job_ids.length')

  requiredJobs: (->
    @get('jobs').filter (data) -> !data.get('allowFailure')
  ).property()

  allowedFailureJobs: (->
    @get('jobs').filter (data) -> data.get('allowFailure')
  ).property()

  configKeys: (->
    return [] unless config = @get('config')
    keys = $.intersect($.keys(config), Travis.CONFIG_KEYS)
    headers = (I18n.t(key) for key in ['build.job', 'build.duration', 'build.finished_at'])
    $.map(headers.concat(keys), (key) -> return $.camelize(key))
  ).property('config')

@Travis.Build.reopenClass
  byRepositoryId: (id, parameters) ->
    @find($.extend(parameters || {}, repository_id: id, orderBy: 'number DESC'))

  olderThanNumber: (id, build_number) ->
    # TODO fix this api and use some kind of pagination scheme
    @find(url: "/builds", repository_id: id, after_number: build_number)
