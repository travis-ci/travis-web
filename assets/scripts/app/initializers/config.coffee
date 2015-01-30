require 'config/environment'

config = ENV.config

initialize = (container, application) ->
  application.register 'config:main', config, { instantiate: false }

  application.inject('controller', 'config', 'config:main')
  application.inject('route', 'config', 'config:main')

ConfigInitializer =
  name: 'config'
  initialize: initialize

Ember.onLoad 'Ember.Application', (Application) ->
  Application.initializer ConfigInitializer
