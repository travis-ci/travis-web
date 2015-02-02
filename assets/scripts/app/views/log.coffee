BasicView = Travis.BasicView

Log.DEBUG = false
Log.LIMIT = 10000
config = ENV.config

View = BasicView.extend
  templateName: 'jobs/log'
  logBinding: 'job.log'

  didInsertElement: ->
    @setupLog()

  logDidChange: (->
    @setupLog()
  ).observes('log')

  logWillChange: (->
    @teardownLog()
  ).observesBefore('log')

  willDestroyElement: ->
    @teardownLog()

  teardownLog: ->
    job = @get('job')
    job.unsubscribe() if job

  setupLog: ->
    job = @get('job')
    if job
      job.get('log').fetch()
      job.subscribe()

Travis.LogView = View
