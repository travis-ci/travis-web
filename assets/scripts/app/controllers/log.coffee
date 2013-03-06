Travis.LogController = Ember.Controller.extend
  needs: ['repo']

  logObserver: (->
    @unsubscribe()
    @subscribe(@get('job'))
  ).observes('job.logId')

  subscribe: (job) ->
    job = @get('job')
    job.subscribe() if job && !job.get('isFinished')

  unsubscribe: ->
    job = @get('subscribed')
    job.unsubscribe() if job
