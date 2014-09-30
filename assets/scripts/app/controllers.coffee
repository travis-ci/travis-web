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

Travis.ApplicationController = Em.Controller.extend
  templateName: 'layouts/home'

  connectLayout: (name) ->
    name = "layouts/#{name}"
    if @get('templateName') != name
      @set('templateName', name)

Travis.MainController = Em.Controller.extend()
Travis.StatsLayoutController = Em.Controller.extend()
Travis.ProfileLayoutController = Em.Controller.extend()
Travis.AuthLayoutController = Em.Controller.extend()

Travis.ProfileInfoController = Em.Controller.extend
  needs: ['currentUser', 'repos']
  userBinding: 'controllers.currentUser'

Travis.FirstSyncController = Em.Controller.extend
  needs: ['currentUser']
  user: Ember.computed.alias('controllers.currentUser')

  isSyncing: Ember.computed.alias('user.isSyncing')

Travis.IndexErrorController = Em.Controller.extend()
Travis.BuildsItemController = Em.ObjectController.extend(Travis.GithubUrlProperties)

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
