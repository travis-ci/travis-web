@Travis = Em.Application.create()

require 'ext/jquery'
require 'locales'
require 'travis/data_store/rest_adapter'
require 'helpers'
require 'models'
require 'views'
require 'templates'
require 'controllers'
require 'routes'

# Travis = window.Travis
Travis.store = DS.Store.extend(
  revision: 4
  adapter: Travis.RestAdapter.create()
  # adapter: Travis.FixtureAdapter.create()
).create()

Travis.initialize()
