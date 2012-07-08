require 'travis/model'

@Travis.Build = Travis.Model.extend
  eventType:       DS.attr('string')
  repositoryId:    DS.attr('number')
  commitId:        DS.attr('number')

  state:           DS.attr('string')
  number:          DS.attr('number')
  branch:          DS.attr('string')
  message:         DS.attr('string')
  result:          DS.attr('number')
  duration:        DS.attr('number')
  startedAt:       DS.attr('string')
  finishedAt:      DS.attr('string')

  # committedAt:     DS.attr('string')
  # committerName:   DS.attr('string')
  # committerEmail:  DS.attr('string')
  # authorName:      DS.attr('string')
  # authorEmail:     DS.attr('string')
  # compareUrl:      DS.attr('string')

  repository: DS.belongsTo('Travis.Repository')
  commit:     DS.belongsTo('Travis.Commit')
  jobs:       DS.hasMany('Travis.Job', key: 'job_ids')

  config: (->
    @getPath 'data.config'
  ).property('data.config')

  isMatrix: (->
    @getPath('data.job_ids.length') > 1
  ).property('data.job_ids.length')

  requiredJobs: (->
    id = @get('id')
    Travis.Job.filter (data) -> (parseInt(data.get('build_id')) == id) && !data.get('allow_failure')
  ).property()

  allowedFailureJobs: (->
    id = @get('id')
    Travis.Job.filter (data) -> (parseInt(data.get('build_id')) == id) && data.get('allow_failure')
  ).property()

  configKeys: (->
    return [] unless config = @get('config')
    keys = $.intersect($.keys(config), Travis.CONFIG_KEYS)
    headers = (I18n.t(key) for key in ['build.job', 'build.duration', 'build.finished_at'])
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
