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
Travis.initialize()
