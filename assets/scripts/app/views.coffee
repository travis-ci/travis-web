require 'ext/ember/namespace'
require 'views/view'

Em.View.reopen
  init: ->
    this.container ||= Travis.__container__

    @_super.apply(this, arguments)

Travis.NotFoundView = Ember.View.extend
  layoutName: 'layouts/simple'

Travis.MainView = Travis.View.extend
  layoutName: 'layouts/home'
  classNames: ['main']

Travis.AuthSigninView = Travis.View.extend
  layoutName: 'layouts/simple'

Travis.InsufficientOauthPermissionsView = Travis.View.extend
  layoutName: 'layouts/simple'

Travis.FirstSyncView = Travis.View.extend
  layoutName: 'layouts/simple'

Travis.SidebarView = Travis.View.extend
  classQueues: (->
    'active' if @get('activeTab') == 'queues'
  ).property('activeTab')

  classWorkers: (->
    'active' if @get('activeTab') == 'workers'
  ).property('activeTab')

  classJobs: (->
    'active' if @get('activeTab') == 'jobs'
  ).property('activeTab')

Travis.QueueItemView = Travis.View.extend
  tagName: 'li'

Travis.QueueView = Em.View.extend
  templateName: 'queues/show'
  init: ->
    @_super.apply this, arguments
    @set 'controller', @get('controller').container.lookup('controller:queues')

require 'views/accounts'
require 'views/annotation'
require 'views/application'
require 'views/build'
require 'views/events'
require 'views/flash'
require 'views/job'
require 'views/log'
require 'views/repo'
require 'views/profile'
require 'views/stats'
require 'views/signin'
require 'views/top'
require 'views/status_images'
require 'views/status_image_input'
require 'views/dashboard'
