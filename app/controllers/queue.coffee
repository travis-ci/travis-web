`import Ember from 'ember'`

Controller = Ember.ArrayController.extend
  content: (->
    @store.filter 'job', {}, (job) ->
      ['created', 'queued'].indexOf(job.get('state')) != -1
  ).property()

`export default Controller`
