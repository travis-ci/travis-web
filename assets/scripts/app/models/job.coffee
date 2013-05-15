require 'travis/model'

@Travis.Job = Travis.Model.extend Travis.DurationCalculations,
  repoId:         DS.attr('number')
  buildId:        DS.attr('number')
  commitId:       DS.attr('number')
  logId:          DS.attr('number')

  queue:          DS.attr('string')
  state:          DS.attr('string')
  number:         DS.attr('string')
  startedAt:      DS.attr('string')
  finishedAt:     DS.attr('string')
  allowFailure:   DS.attr('boolean')

  repositorySlug: DS.attr('string')
  repo:   DS.belongsTo('Travis.Repo')
  build:  DS.belongsTo('Travis.Build')
  commit: DS.belongsTo('Travis.Commit')

  # this is a fake relationship just to get rid
  # of ember data's bug: https://github.com/emberjs/data/issues/758
  # TODO: remove when this issue is fixed
  fakeBuild:  DS.belongsTo('Travis.Build')

  _config: DS.attr('object')

  repoSlugDidChange: (->
    if slug = @get('repoSlug')
      @get('store').loadIncomplete(Travis.Repo, {
        id: @get('repoId'),
        slug: slug
      }, { skipIfExists: true })
  ).observes('repoSlug')

  log: ( ->
    @set('isLogAccessed', true)
    Travis.Log.create(job: this)
  ).property()

  repoSlug: (->
    @get('repositorySlug')
  ).property('repositorySlug')

  config: (->
    Travis.Helpers.compact(@get('_config'))
  ).property('_config')

  isFinished: (->
    @get('state') in ['passed', 'failed', 'errored', 'canceled']
  ).property('state')

  clearLog: ->
    # This is needed if we don't want to fetch log just to clear it
    if @get('isLogAccessed')
      @get('log').clear()

  sponsor: (->
    {
      name: "Blue Box"
      url: "http://bluebox.net"
    }
  ).property()

  configValues: (->
    config = @get('config')
    keys   = @get('build.rawConfigKeys')

    if config && keys
      keys.map (key) -> config[key]
    else
      []
  ).property('config', 'build.rawConfigKeys.length')

  canCancel: (->
    @get('state') == 'created' || @get('state') == 'queued' # TODO
  ).property('state')

  cancel: (->
    Travis.ajax.post "/jobs/#{@get('id')}", _method: 'delete'
  )

  requeue: ->
    Travis.ajax.post '/requests', job_id: @get('id')

  appendLog: (part) ->
    @get('log').append part

  subscribe: ->
    return if @get('subscribed')
    @set('subscribed', true)
    if Travis.pusher
      Travis.pusher.subscribe "job-#{@get('id')}"

  unsubscribe: ->
    return unless @get('subscribed')
    @set('subscribed', false)
    if Travis.pusher
      Travis.pusher.unsubscribe "job-#{@get('id')}"

  onStateChange: (->
    if @get('state') == 'finished' && Travis.pusher
      Travis.pusher.unsubscribe "job-#{@get('id')}"
  ).observes('state')

  isAttributeLoaded: (key) ->
    if ['finishedAt'].contains(key) && !@get('isFinished')
      return true
    else if key == 'startedAt' && @get('state') == 'created'
      return true
    else
      @_super(key)

  isFinished: (->
    @get('state') in ['passed', 'failed', 'errored', 'canceled']
  ).property('state')

@Travis.Job.reopenClass
  queued: (queue) ->
    @find()
    Travis.store.filter this, (job) ->
      queued = ['created', 'queued'].indexOf(job.get('state')) != -1
      # TODO: why queue is sometimes just common instead of build.common?
      queued && (!queue || job.get('queue') == "builds.#{queue}" || job.get('queue') == queue)

  running: ->
    @find(state: 'started')
    Travis.store.filter this, (job) ->
      job.get('state') == 'started'

  findMany: (ids) ->
    Travis.store.findMany this, ids

