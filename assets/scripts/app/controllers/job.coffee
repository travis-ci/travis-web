Travis.JobController = Em.Controller.extend
  needs: ['repo']

  jobBinding: 'controllers.repo.job'
  repoBinding: 'controllers.repo.repo'
  commitBinding: 'job.commit'
