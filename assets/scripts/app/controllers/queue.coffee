require 'models/job'
Job = Travis.Job

Controller = Em.ArrayController.extend
  content: (->
    @store.filter 'job', {}, (job) ->
      ['created', 'queued'].indexOf(job.get('state')) != -1
  ).property()

Travis.QueueController = Controller
