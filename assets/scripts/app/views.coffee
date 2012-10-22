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

require 'views/accounts'
require 'views/application'
require 'views/build'
require 'views/events'
require 'views/flash'
require 'views/job'
require 'views/repo'
require 'views/profile'
require 'views/sidebar'
require 'views/stats'
require 'views/signin'
require 'views/top'
