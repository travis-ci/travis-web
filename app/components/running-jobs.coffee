`import Ember from 'ember'`
`import Polling from 'travis/mixins/polling'`
`import config from 'travis/config/environment'`

RunningJobsComponent = Ember.Component.extend Polling,
  store: Ember.inject.service()

  pollHook: (store) ->
    @get('store').find('job', {})

  init: ->
    @_super.apply this, arguments
    if !Ember.testing
      Visibility.every config.intervals.updateTimes, @updateTimes.bind(this)

  updateTimes: ->
    if jobs = @get('jobs')
      jobs.forEach (job) -> job.updateTimes()

`export default RunningJobsComponent`
