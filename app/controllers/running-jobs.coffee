`import Ember from 'ember'`

Controller = Ember.ArrayController.extend
  init: ->
    @_super.apply this, arguments
    if !Ember.testing
      Visibility.every @config.intervals.updateTimes, @updateTimes.bind(this)

  updateTimes: ->
    if content = @get('content')
      content.forEach (job) -> job.updateTimes()

  isLoaded: false
  content: (->
    result = @store.filter('job', { state: 'started' }, (job) ->
      ['started', 'received'].indexOf(job.get('state')) != -1
    )
    result.then =>
      @set('isLoaded', true)
    result
  ).property()

`export default Controller`
