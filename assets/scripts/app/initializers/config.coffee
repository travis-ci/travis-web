initialize = (container, application) ->
  application.register 'config:main', application.config, { instantiate: false }

  application.inject('controller', 'config', 'config:main')
  application.inject('route', 'config', 'config:main')
  application.inject('auth', 'config', 'config:main')

ConfigInitializer =
  name: 'pusher'
  initialize: initialize

Ember.onLoad 'Ember.Application', (Application) ->
  Application.initializer ConfigInitializer
