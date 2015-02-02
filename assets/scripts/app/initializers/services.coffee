config = ENV.config
Slider = Travis.Slider
Tailing = Travis.Tailing
ToTop = Travis.ToTop

initialize = (container, application) ->
  application.slider = new Slider(application.storage)

  application.tailing = new Tailing($(window), '#tail', '#log')
  application.toTop   = new ToTop($(window), '.to-top', '#log-container')

Initializer =
  name: 'services'
  initialize: initialize

Ember.onLoad 'Ember.Application', (Application) ->
  Application.initializer Initializer
