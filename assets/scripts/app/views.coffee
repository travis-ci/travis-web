require 'ext/ember/namespace'

@Travis.reopen
  View: Em.View.extend
    popup: (event) ->
      @popupCloseAll()
      $("##{event.target.name}").toggleClass('display')
    popupClose: (event) ->
      $(event.target).closest('.popup').removeClass('display')
    popupCloseAll: ->
      $('.popup').removeClass('display')


@Travis.reopen
  HomeView:          Travis.View.extend(templateName: 'layouts/home')
  AuthLayoutView:    Travis.View.extend(templateName: 'layouts/simple')
  ProfileLayoutView: Travis.View.extend(templateName: 'layouts/profile')
  StatsLayoutView:   Travis.View.extend(templateName: 'layouts/simple')
  ApplicationView:   Travis.View.extend
    templateName: 'application'
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

require 'views/accounts'
require 'views/build'
require 'views/flash'
require 'views/job'
require 'views/repo'
require 'views/profile'
require 'views/sidebar'
require 'views/stats'
require 'views/signin'
require 'views/top'
