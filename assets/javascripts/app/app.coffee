require 'routes'
#= require_tree ./helpers
#= require_tree ./models
#= require_tree ./templates
#= require ./controllers.js
#= require ./views.js
#= require ./routes.js
#= require_self

Travis = window.Travis
Travis.store = DS.Store.extend(
  revision: 4
  adapter: Travis.FixtureAdapter.create()
).create()

# apparently fixtures behave weird unless preloaded :/ should move to mockjax for testing
Travis.Build.find()
Travis.Repository.find()
Travis.Commit.find()
Travis.Job.find()
Travis.Artifact.find()

Travis.initialize()
