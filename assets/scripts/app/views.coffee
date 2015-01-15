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
require 'views/show-more-button'
