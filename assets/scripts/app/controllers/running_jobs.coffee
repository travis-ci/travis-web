require 'models/job'
Job = Travis.Job

Controller = Em.ArrayController.extend
  content: (->
    Job.running()
  ).property()

Travis.RunningJobsController = Controller
