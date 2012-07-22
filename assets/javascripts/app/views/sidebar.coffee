@Travis.reopen
  SidebarView: Travis.View.extend
    templateName: 'layouts/sidebar'

    toggleSidebar: ->
      $('body').toggleClass('maximized')
      element = $('<span></span>') # TODO gotta force redraw here :/
      $('#repository').append(element)
      Em.run.later (-> element.remove()), 10

  WorkersView: Travis.View.extend
    toggle: (event) ->
      $(event.target).closest('li').toggleClass('open')


