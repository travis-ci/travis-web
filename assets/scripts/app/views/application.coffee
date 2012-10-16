@Travis.reopen
  ApplicationView: Travis.View.extend
    templateName: 'application'
    classNames: ['application']

    popup: (event) ->
      console.log event
    localeDidChange: (->
      if locale = Travis.app.get('auth.user.locale')
        Travis.setLocale(locale)
        Travis.app.get('router').reload()
    ).observes('Travis.app.auth.user.locale')

    click: (event) ->
      # TODO: this solves the case of closing menus and popups,
      #       but I would like to rewrite it later, not sure how
      #       yet, but this does not seem optimal
      targetAndParents = $(event.target).parents().andSelf()
      if ! ( targetAndParents.hasClass('open-popup') || targetAndParents.hasClass('popup') )
        @popupCloseAll()
      if ! targetAndParents.hasClass('menu')
        $('.menu').removeClass('display')

