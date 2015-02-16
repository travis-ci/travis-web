`import Ember from 'ember'`

Controller = Ember.ArrayController.extend
  content: (->
    @store.filter 'job', { state: 'started' }, (job) ->
      ['started', 'received'].indexOf(job.get('state')) != -1
  ).property()

`export default Controller`
