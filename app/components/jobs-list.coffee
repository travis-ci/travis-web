`import Ember from 'ember'`

JobsListComponent = Ember.Component.extend
  jobTableId: Ember.computed(->
    if @get('required')
      'jobs'
    else
      'allowed_failure_jobs'
  )

`export default JobsListComponent`
