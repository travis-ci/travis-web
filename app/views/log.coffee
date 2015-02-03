`import BasicView from 'travis/views/basic'`
`import config from 'travis/config/environment'`

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

`export default View`
