require 'travis/model'

@Travis.Build = Travis.Model.extend Travis.DurationCalculations,
  repositoryId:     Ember.attr('number')
  commitId:         Ember.attr('number')

  state:            Ember.attr('string')
  number:           Ember.attr('string')
  branch:           Ember.attr('string')
  message:          Ember.attr('string')
  _duration:        Ember.attr(Number, key: 'duration')
  _config:          Ember.attr('object', key: 'config')
  startedAt:        Ember.attr('string')
  finishedAt:       Ember.attr('string')
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
    !@get('isFinished') && @get('jobs').filter( (j) -> j.get('canCancel') ).get('length') > 0
  ).property('isFinished', 'jobs.@each.canCancel')

  cancel: (->
    Travis.ajax.post "/builds/#{@get('id')}/cancel"
  )

  requeue: ->
    Travis.ajax.post '/requests', build_id: @get('id')

  isPropertyLoaded: (key) ->
    if ['_duration', 'finishedAt'].contains(key) && !@get('isFinished')
      return true
    else
      @_super(key)


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
