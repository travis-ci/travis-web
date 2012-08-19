require 'ext/ember/namespace'

@Travis.reopen
  View: Em.View.extend
    route: (event) ->
      Travis.app.routes.route(event)

@Travis.reopen
  HomeLayout:    Travis.View.extend(templateName: 'layouts/home')
  ProfileLayout: Travis.View.extend(templateName: 'layouts/simple')
  StatsLayout:   Travis.View.extend(templateName: 'layouts/simple')

require 'views/build'
require 'views/job'
require 'views/repo'
require 'views/profile'
require 'views/sidebar'
require 'views/stats'
require 'views/tabs'
require 'views/top'

