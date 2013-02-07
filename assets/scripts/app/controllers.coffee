require 'helpers'
require 'travis/ticker'

Travis.reopen
  Controller: Em.Controller.extend()

  TopController: Em.Controller.extend
    userBinding: 'Travis.app.currentUser'

  ApplicationController: Em.Controller.extend()
  MainController: Em.Controller.extend()
  StatsLayoutController: Em.Controller.extend()
  ProfileLayoutController: Em.Controller.extend()
  AuthLayoutController: Em.Controller.extend()

require 'controllers/accounts'
require 'controllers/builds'
require 'controllers/flash'
require 'controllers/home'
require 'controllers/profile'
require 'controllers/repos'
require 'controllers/repo'
require 'controllers/running_jobs'
require 'controllers/sidebar'
require 'controllers/stats'
