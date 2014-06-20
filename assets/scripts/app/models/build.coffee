require 'travis/model'

@Travis.Build = Travis.Model.extend Travis.DurationCalculations,
  repositoryId:     Ember.attr('number')
  commitId:         Ember.attr('number')

  state:            Ember.attr('string')
  number:           Ember.attr(Number)
  branch:           Ember.attr('string')
  message:          Ember.attr('string')
  _duration:        Ember.attr(Number, key: 'duration')
  _config:          Ember.attr('object', key: 'config')
  _startedAt:       Ember.attr('string', key: 'started_at')
  _finishedAt:      Ember.attr('string', key: 'finished_at')
  pullRequest:      Ember.attr('boolean')
  pullRequestTitle: Ember.attr('string')
  pullRequestNumber: Ember.attr(Number)

  repo:   Ember.belongsTo('Travis.Repo', key: 'repository_id')
  commit: Ember.belongsTo('Travis.Commit')
  jobs:   Ember.hasMany('Travis.Job')

  config: (->
    Travis.Helpers.compact(@get('_config'))
  ).property('_config')

  isPullRequest: (->
    @get('eventType') == 'pull_request' || @get('pullRequest')
  ).property('eventType')

  isMatrix: (->
    @get('jobs.length') > 1
  ).property('jobs.length')

  isFinished: (->
    @get('state') in ['passed', 'failed', 'errored', 'canceled']
  ).property('state')

  notStarted: (->
    @get('state') in ['queued', 'created']
  ).property('state')

  startedAt: (->
    unless @get('notStarted')
      @get('_startedAt')
  ).property('_startedAt')

  finishedAt: (->
    unless @get('notStarted')
      @get('_finishedAt')
  ).property('_finishedAt')

  requiredJobs: (->
    @get('jobs').filter (data) -> !data.get('allowFailure')
  ).property('jobs.@each.allowFailure')

  allowedFailureJobs: (->
    @get('jobs').filter (data) -> data.get('allowFailure')
  ).property('jobs.@each.allowFailure')

  rawConfigKeys: (->
    keys = []

    @get('jobs').forEach (job) ->
      Travis.Helpers.configKeys(job.get('config')).forEach (key) ->
        keys.pushObject key unless keys.contains key

    keys
  ).property('config', 'jobs.@each.config')

  configKeys: (->
    keys = @get('rawConfigKeys')
    headers = ['Job', 'Duration', 'Finished']
    $.map(headers.concat(keys), (key) -> if Travis.CONFIG_KEYS_MAP.hasOwnProperty(key) then Travis.CONFIG_KEYS_MAP[key] else key)
  ).property('rawConfigKeys.length')

  canCancel: (->
    !@get('isFinished') && @get('jobs').filter( (j) -> j.get('canCancel') ).get('length') > 0
  ).property('isFinished', 'jobs.@each.canCancel')

  cancel: (->
    Travis.ajax.post "/builds/#{@get('id')}/cancel"
  )

  requeue: ->
    Travis.ajax.post "/builds/#{@get('id')}/restart"

  isPropertyLoaded: (key) ->
    if ['_duration', 'finishedAt'].contains(key) && !@get('isFinished')
      return true
    else
      @_super(key)

  formattedFinishedAt: (->
    if finishedAt = @get('finishedAt')
      moment(finishedAt).format('lll')
  ).property('finishedAt')

@Travis.Build.reopenClass
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
