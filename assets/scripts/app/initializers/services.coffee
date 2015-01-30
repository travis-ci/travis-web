config = ENV.config
Slider = Travis.Slider
Pusher = Travis.Pusher
Tailing = Travis.Tailing
ToTop = Travis.ToTop

initialize = (container, application) ->
  application.slider = new Slider(application.storage)

  if config.pusher.key
    application.pusher = new Pusher(config.pusher)

  application.tailing = new Tailing($(window), '#tail', '#log')
  application.toTop   = new ToTop($(window), '.to-top', '#log-container')

Initializer =
  name: 'services'
  initialize: initialize

Ember.onLoad 'Ember.Application', (Application) ->
  Application.initializer Initializer
