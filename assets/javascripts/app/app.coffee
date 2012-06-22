@Travis = Em.Application.create()

require 'ext/jquery'
require 'locales'
require 'travis/data_store_adapter'
require 'helpers'
require 'models'
require 'views'
require 'templates'
require 'controllers'
require 'routes'

# Travis = window.Travis
Travis.store = DS.Store.extend(
  revision: 4
  adapter: Travis.FixtureAdapter.create()
).create()

# apparently fixtures behave weird unless preloaded :/ should move to mockjax for testing
Travis.Repository.find()
Travis.Build.find()
Travis.Commit.find()
Travis.Job.find()
Travis.Artifact.find()

Travis.initialize()
