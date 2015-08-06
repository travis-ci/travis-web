`import Ember from 'ember'`
`import config from 'travis/config/environment'`

QueuedJobsComponent = Ember.Component.extend
  store: Ember.inject.service()

  init: ->
    @_super.apply this, arguments
    if !Ember.testing
      Visibility.every config.intervals.updateTimes, @updateTimes.bind(this)

  updateTimes: ->
    if jobs = @get('jobs')
      jobs.forEach (job) -> job.updateTimes()

`export default QueuedJobsComponent`
