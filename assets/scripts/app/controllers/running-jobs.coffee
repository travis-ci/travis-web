require 'models/job'
Job = Travis.Job

Controller = Em.ArrayController.extend
  content: (->
    @store.filter 'job', { state: 'started' }, (job) ->
      ['started', 'received'].indexOf(job.get('state')) != -1
  ).property()

Travis.RunningJobsController = Controller
