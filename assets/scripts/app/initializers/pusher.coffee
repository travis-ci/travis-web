require 'utils/pusher'

config = ENV.config
Pusher = Travis.Pusher

initialize = (container, application) ->
  if config.pusher.key
    application.pusher = new Pusher(config.pusher)

  application.register 'pusher:main', application.pusher, { instantiate: false }

  application.inject('route', 'pusher', 'pusher:main')

  application.pusher.store = container.lookup('store:main')


PusherInitializer =
  name: 'pusher'
  initialize: initialize

Ember.onLoad 'Ember.Application', (Application) ->
  Application.initializer PusherInitializer
