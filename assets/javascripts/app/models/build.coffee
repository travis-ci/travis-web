require 'travis/model'

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

  # TODO why does the hasMany association not work?
  jobs: (->
    Travis.Job.findMany(@getPath('data.job_ids') || [])
  ).property('data.job_ids.length')

  isMatrix: (->
    @getPath('data.job_ids.length') > 1
  ).property('data.job_ids.length')

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
