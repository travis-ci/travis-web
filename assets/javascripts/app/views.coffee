require 'ext/ember/namespace'

@Travis.reopen
  View: Em.View.extend
    route: (event) ->
      Travis.app.routes.route(event)

    popup: (event) ->
      $("##{event.target.name}").remove().appendTo('body').toggle()

@Travis.reopen
  HomeLayout:    Travis.View.extend(templateName: 'layouts/home')
  ProfileLayout: Travis.View.extend(templateName: 'layouts/profile')
  StatsLayout:   Travis.View.extend(templateName: 'layouts/simple')

require 'views/build'
require 'views/job'
require 'views/repo'
require 'views/profile'
require 'views/sidebar'
require 'views/stats'
require 'views/top'

