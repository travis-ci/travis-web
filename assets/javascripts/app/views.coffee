require 'ext/ember/namespace'

@Travis.reopen
  HomeLayout:    Em.View.extend(templateName: 'layouts/home')
  ProfileLayout: Em.View.extend(templateName: 'layouts/simple')
  StatsLayout:   Em.View.extend(templateName: 'layouts/simple')

  StatsView:     Em.View.extend(templateName: 'stats/show')

  SidebarView: Em.View.extend
    templateName: 'layouts/sidebar'

    toggleSidebar: ->
      $('body').toggleClass('maximized')
      element = $('<span></span>') # TODO gotta force redraw here :/
      $('#repository').append(element)
      Em.run.later (-> element.remove()), 10

  WorkersView: Em.View.extend
    toggle: (event) ->
      $(event.target).closest('li').toggleClass('open')

require 'views/build'
require 'views/job'
require 'views/repo'
require 'views/profile'
require 'views/tabs'
require 'views/top'

