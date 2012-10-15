@Travis.reopen
  ApplicationView: Travis.View.extend
    templateName: 'application'
    classNames: ['application']

    localeDidChange: (->
      if locale = Travis.app.get('auth.user.locale')
        Travis.setLocale(locale)
        Travis.app.get('router').reload()
    ).observes('Travis.app.auth.user.locale')

    click: (event) ->
      # TODO: this solves the case of closing menus and popups,
      #       but I would like to rewrite it later, not sure how
      #       yet, but this does not seem optimal
      if ! $(event.target).parents().andSelf().hasClass('popup')
        @popupCloseAll()
      if ! $(event.target).parents().andSelf().hasClass('menu')
        $('.menu').removeClass('display')

