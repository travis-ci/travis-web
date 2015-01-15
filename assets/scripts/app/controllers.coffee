require 'helpers'

Travis.AccountsInfoController = Em.Controller.extend
  needs: ['currentUser', 'repos']
  userBinding: 'controllers.currentUser'

Travis.MainErrorController = Em.Controller.extend()
Travis.BuildsItemController = Em.ObjectController.extend(Travis.GithubUrlProperties,
  needs: ['builds']
  isPullRequestsListBinding: 'controllers.builds.isPullRequestsList'
  buildBinding: 'content'
)

Travis.QueueController = Em.ArrayController.extend
  content: (->
    Travis.Job.queued()
  ).property()

Travis.RunningJobsController = Em.ArrayController.extend
  content: (->
    Travis.Job.running()
  ).property()

require 'controllers/accounts'
require 'controllers/auth'
require 'controllers/account'
require 'controllers/build'
require 'controllers/builds'
require 'controllers/flash'
require 'controllers/job'
require 'controllers/profile'
require 'controllers/repos'
require 'controllers/repo'
require 'controllers/settings'
require 'controllers/current_user'
require 'controllers/request'
require 'controllers/requests'
require 'controllers/caches'
require 'controllers/env_var'
require 'controllers/env_vars'
require 'controllers/env_var_new'
require 'controllers/ssh_key'
require 'controllers/sidebar'
require 'controllers/top'
require 'controllers/first_sync'
