require 'helpers'

Travis.Controller    = Em.Controller.extend()
Travis.TopController = Em.Controller.extend
  needs: ['currentUser']
  userBinding: 'controllers.currentUser'

  userName: (->
    @get('user.name') || @get('user.login')
  ).property('user.login', 'user.name')

  gravatarUrl: (->
    "#{location.protocol}//www.gravatar.com/avatar/#{@get('user.gravatarId')}?s=48&d=mm"
  ).property('user.gravatarId')

  signedIn: (->
    Travis.get('authState') == 'signed-in'
  ).property('Travis.authState')

  signedOut: (->
    Travis.get('authState') == 'signed-out'
  ).property('Travis.authState')

  signingIn: (->
    Travis.get('authState') == 'signing-in'
  ).property('Travis.authState')

Travis.MainController = Em.Controller.extend()
Travis.StatsLayoutController = Em.Controller.extend()
Travis.ProfileLayoutController = Em.Controller.extend()
Travis.AuthLayoutController = Em.Controller.extend()

Travis.AccountsInfoController = Em.Controller.extend
  needs: ['currentUser', 'repos']
  userBinding: 'controllers.currentUser'

Travis.FirstSyncController = Em.Controller.extend
  needs: ['currentUser']
  user: Ember.computed.alias('controllers.currentUser')

  isSyncing: Ember.computed.alias('user.isSyncing')

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

Travis.SidebarController = Em.ArrayController.extend
  init: ->
    @_super.apply this, arguments
    @tickables = []

  tips: [
    "Did you know that you can parallelize tests on Travis CI? <a href=\"http://docs.travis-ci.com/user/speeding-up-the-build/#Paralellizing-your-build-on-one-VM?utm_source=tips\">Learn more</a>"
    "Did you know that you can split a build into several smaller pieces? <a href=\"http://docs.travis-ci.com/user/speeding-up-the-build/#Parallelizing-your-builds-across-virtual-machines?utm_source=tips\">Learn more</a>"
    "Did you know that you can skip a build? <a href=\"http://docs.travis-ci.com/user/how-to-skip-a-build/?utm_source=tips\">Learn more</a>"
  ]

  tip: (->
    if tips = @get('tips')
      tips[Math.floor(Math.random()*tips.length)]
  ).property().volatile()

require 'controllers/accounts'
require 'controllers/auth'
require 'controllers/account'
require 'controllers/build'
require 'controllers/builds'
require 'controllers/flash'
require 'controllers/home'
require 'controllers/job'
require 'controllers/profile'
require 'controllers/repos'
require 'controllers/repo'
require 'controllers/settings'
require 'controllers/stats'
require 'controllers/current_user'
require 'controllers/request'
require 'controllers/requests'
require 'controllers/caches'
require 'controllers/env_var'
require 'controllers/env_vars'
require 'controllers/env_var_new'
require 'controllers/ssh_key'
