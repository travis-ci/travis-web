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

Travis.AccountProfileController = Em.Controller.extend
  needs: ['currentUser', 'repos']
  userBinding: 'controllers.currentUser'

Travis.FirstSyncController = Em.Controller.extend
  needs: ['currentUser']
  user: Ember.computed.alias('controllers.currentUser')

  isSyncing: Ember.computed.alias('user.isSyncing')

Travis.RepoSettingsTabController = Em.ObjectController.extend()
Travis.RepoSettingsController = Em.ObjectController.extend
  needs: ['repoSettingsTab']
  tab: Ember.computed.alias('controllers.repoSettingsTab.model.tab')
  settings: Ember.computed.alias('model.settings')

  submit: ->
    @set('saving', true)
    self = this
    @get('model').saveSettings(@get('settings')).then ->
      self.set('saving', false)
      Travis.flash(success: 'Settings were saved successfully')
    , ->
      self.set('saving', false)
      Travis.flash(error: 'There was an error while saving settings. Please try again.')

require 'controllers/accounts'
require 'controllers/build'
require 'controllers/builds'
require 'controllers/flash'
require 'controllers/home'
require 'controllers/job'
require 'controllers/profile'
require 'controllers/repos'
require 'controllers/repo'
require 'controllers/stats'
require 'controllers/current_user'
require 'controllers/account_index'

