@Travis.Build = Travis.Model.extend # Travis.Helpers,
  repository_id:   DS.attr('number')
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
    @get('allowedFailureJobs').length > 0
  ).property('allowedFailureJobs')

  # TODO why does the hasMany association not work?
  jobs: (->
    Travis.Job.findMany(@getPath('data.job_ids'))
  ).property('data.job_ids.length')

  requiredJobs: (->
    @get('jobs').filter (item, index) -> item.get('allow_failure') isnt true
  ).property('jobs')

  allowedFailureJobs: (->
    @get('jobs').filter (item, index) -> item.get 'allow_failure'
  ).property('jobs')

  tick: ->
    @notifyPropertyChange 'duration'
    @notifyPropertyChange 'finished_at'

@Travis.Build.reopenClass
  byRepositoryId: (id, parameters) ->
    @find($.extend(parameters || {}, repository_id: id, orderBy: 'number DESC'))

  olderThanNumber: (id, build_number) ->
    @find(url: '/repositories/' + id + '/builds.json?bare=true&after_number=' + build_number, repository_id: id, orderBy: 'number DESC')

@Travis.Build.FIXTURES = [
  { id: 1, repository_id: 1, number: 1, event_type: 'push' },
  { id: 2, repository_id: 1, number: 2, event_type: 'push' },
  { id: 3, repository_id: 2, number: 3, event_type: 'push' },
  { id: 4, repository_id: 3, number: 4, event_type: 'push' }
]
