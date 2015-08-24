`import { durationFrom, configKeys, compact } from 'travis/utils/helpers'`
`import configKeysMap from 'travis/utils/keys-map'`
`import Ember from 'ember'`
`import Model from 'travis/models/model'`
`import DurationCalculations from 'travis/utils/duration-calculations'`

Build = Model.extend DurationCalculations,
  ajax: Ember.inject.service()

  state:             DS.attr()
  number:            DS.attr('number')
  branch:            DS.attr('string')
  message:           DS.attr('string')
  _duration:         DS.attr('number')
  _config:           DS.attr('object')
  _startedAt:        DS.attr()
  _finishedAt:       DS.attr()
  pullRequest:       DS.attr('boolean')
  pullRequestTitle:  DS.attr()
  pullRequestNumber: DS.attr('number')
  eventType:         DS.attr('string')

  repo:   DS.belongsTo('repo', async: true)
  commit: DS.belongsTo('commit', async: true)
  jobs:   DS.hasMany('job', async: true)

  config: (->
    console.log('config')
    if config = @get('_config')
      compact(config)
    else if @get('currentState.stateName') != 'root.loading'
      return if @get('isFetchingConfig')
      @set 'isFetchingConfig', true

      @reload()
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
    @get('state') in ['queued', 'created', 'received']
  ).property('state')

  startedAt: (->
    unless @get('notStarted')
      @get('_startedAt')
  ).property('_startedAt', 'notStarted')

  finishedAt: (->
    unless @get('notStarted')
      @get('_finishedAt')
  ).property('_finishedAt', 'notStarted')

  requiredJobs: (->
    @get('jobs').filter (data) -> !data.get('allowFailure')
  ).property('jobs.@each.allowFailure')

  allowedFailureJobs: (->
    @get('jobs').filter (data) -> data.get('allowFailure')
  ).property('jobs.@each.allowFailure')

  rawConfigKeys: (->
    keys = []

    @get('jobs').forEach (job) ->
      configKeys(job.get('config')).forEach (key) ->
        keys.pushObject key unless keys.contains key

    keys
  ).property('config', 'jobs.@each.config')

  configKeys: (->
    keys = @get('rawConfigKeys')
    headers = ['Job', 'Duration', 'Finished']
    $.map(headers.concat(keys), (key) -> if configKeysMap.hasOwnProperty(key) then configKeysMap[key] else key)
  ).property('rawConfigKeys.length')

  canCancel: (->
    @get('jobs').filterBy('canCancel').length
  ).property('jobs.@each.canCancel')

  canRestart: Ember.computed.alias('isFinished')

  cancel: (->
    @get('ajax').post "/builds/#{@get('id')}/cancel"
  )

  restart: ->
    @get('ajax').post "/builds/#{@get('id')}/restart"

  formattedFinishedAt: (->
    if finishedAt = @get('finishedAt')
      moment(finishedAt).format('lll')
  ).property('finishedAt')

`export default Build`
