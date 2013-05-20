require 'travis/model'

@Travis.Build = Travis.Model.extend Travis.DurationCalculations,
  eventType:        DS.attr('string')
  repoId:           DS.attr('number')
  commitId:         DS.attr('number')

  state:            DS.attr('string')
  number:           DS.attr('number')
  branch:           DS.attr('string')
  message:          DS.attr('string')
  _duration:        DS.attr('number')
  _config:          DS.attr('object')
  startedAt:        DS.attr('string')
  finishedAt:       DS.attr('string')
  pullRequest:      DS.attr('boolean')
  pullRequestTitle: DS.attr('string')
  pullRequestNumber: DS.attr('number')

  repo:   DS.belongsTo('Travis.Repo')
  commit: DS.belongsTo('Travis.Commit')
  jobs:   DS.hasMany('Travis.Job')

  config: (->
    Travis.Helpers.compact(@get('_config'))
  ).property('_config')

  isPullRequest: (->
    @get('eventType') == 'pull_request'
  ).property('eventType')

  isMatrix: (->
    @get('jobs.length') > 1
  ).property('jobs.length')

  isFinished: (->
    @get('state') in ['passed', 'failed', 'errored', 'canceled']
  ).property('state')

  requiredJobs: (->
    @get('jobs').filter (data) -> !data.get('allowFailure')
  ).property('jobs.@each.allowFailure')

  allowedFailureJobs: (->
    @get('jobs').filter (data) -> data.get('allowFailure')
  ).property('jobs.@each.allowFailure')

  rawConfigKeys: (->
    keys = Travis.Helpers.configKeys(@get('config'))

    @get('jobs').forEach (job) ->
      Travis.Helpers.configKeys(job.get('config')).forEach (key) ->
        keys.pushObject key unless keys.contains key

    keys
  ).property('config', 'jobs.@each.config')

  configKeys: (->
    keys = @get('rawConfigKeys')
    headers = (I18n.t(key) for key in ['build.job', 'build.duration', 'build.finished_at'])
    $.map(headers.concat(keys), (key) -> return $.camelize(key))
  ).property('rawConfigKeys.length')

  canCancel: (->
    @get('state') == 'created' # TODO
  ).property('state')

  cancel: (->
    Travis.ajax.post "/builds/#{@get('id')}", _method: 'delete'
  )

  requeue: ->
    Travis.ajax.post '/requests', build_id: @get('id')

  isAttributeLoaded: (key) ->
    if ['_duration', 'finishedAt'].contains(key) && !@get('isFinished')
      return true
    else
      @_super(key)


@Travis.Build.reopenClass
  recent: ->
    @find()

  byRepoId: (id, parameters) ->
    @find($.extend(parameters || {}, repository_id: id))

  branches: (options) ->
    @find repository_id: options.repoId, branches: true

  olderThanNumber: (id, build_number, type) ->
    console.log type
    # TODO fix this api and use some kind of pagination scheme
    options = { repository_id: id, after_number: build_number }
    if type?
      options.event_type = type.replace(/s$/, '') # poor man's singularize

    @find(options)
