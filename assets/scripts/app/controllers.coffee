require 'helpers'
require 'travis/ticker'

Travis.Controller    = Em.Controller.extend()
Travis.TopController = Em.Controller.extend
    userBinding: 'Travis.app.currentUser'

Travis.ApplicationController = Em.Controller.extend()
Travis.MainController = Em.Controller.extend()
Travis.StatsLayoutController = Em.Controller.extend()
Travis.ProfileLayoutController = Em.Controller.extend()
Travis.AuthLayoutController = Em.Controller.extend()
Travis.CurrentUserController = Em.ObjectController.extend()

require 'controllers/accounts'
require 'controllers/build'
require 'controllers/builds'
require 'controllers/flash'
require 'controllers/home'
require 'controllers/job'
require 'controllers/profile'
require 'controllers/repos'
require 'controllers/repo'
require 'controllers/running_jobs'
require 'controllers/sidebar'
require 'controllers/stats'
