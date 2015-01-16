require 'models/job'
Job = Travis.Job

Controller = Em.ArrayController.extend
  content: (->
    Job.queued()
  ).property()

Travis.QueueController = Controller
