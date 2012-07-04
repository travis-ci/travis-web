require 'ext/ember/namespace'

@Travis.Views = Em.Namespace.create
  HomeLayout:    Em.View.extend(templateName: 'layouts/home')
  ProfileLayout: Em.View.extend(templateName: 'layouts/simple')
  StatsLayout:   Em.View.extend(templateName: 'layouts/simple')

  StatsView:     Em.View.extend(templateName: 'stats/show')

  SidebarView: Em.View.extend
    templateName: 'layouts/sidebar'

    toggleSidebar: ->
      $('body').toggleClass('maximized')
      # TODO gotta force redraw here :/
      element = $('<span></span>')
      $('#repository').append(element)
      Em.run.later (-> element.remove()), 10

require 'views/build'
require 'views/job'
require 'views/repo'
require 'views/profile'
require 'views/tabs'
require 'views/top'

