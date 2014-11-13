Travis.reopen
  ApplicationView: Travis.View.extend
    click: (event) ->
      # TODO: this solves the case of closing menus and popups,
      #       but I would like to rewrite it later, not sure how
      #       yet, but this does not seem optimal
      targetAndParents = $(event.target).parents().andSelf()
      if ! ( targetAndParents.hasClass('open-popup') || targetAndParents.hasClass('popup') )
        @popupCloseAll()

      # TODO: I needed to add second check to this conditional, because for some reason
      #       event.stopPropagation() in menu() function in RepoShowToolsView does
      #       not prevent calling following code
      if ! targetAndParents.hasClass('menu') && !targetAndParents.is('#tools > a')
        $('.menu').removeClass('display')

