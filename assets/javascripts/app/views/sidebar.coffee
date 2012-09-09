@Travis.reopen
  SidebarView: Travis.View.extend
    templateName: 'layouts/sidebar'

  WorkersView: Travis.View.extend
    toggle: (event) ->
      $(event.target).closest('li').toggleClass('open')


