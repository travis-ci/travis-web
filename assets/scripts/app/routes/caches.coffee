require 'routes/route'
require 'models/request'
require 'utils/ajax'

Request = Travis.Request
Ajax = Travis.ajax
TravisRoute = Travis.Route

Route = TravisRoute.extend
  needsAuth: true
  setupController: ->
    @_super.apply this, arguments
    @controllerFor('repo').activate('caches')

  model: ->
    repo = @modelFor('repo')
    Ajax.get("/repos/#{repo.get('id')}/caches").then( (data) ->
      groups = {}
      data["caches"].forEach (cacheData) ->
        branch = cacheData["branch"]
        group = groups[branch]
        unless group
          group = groups[branch] = Ember.Object.create(branch: branch, caches: [])
        cache = Ember.Object.create(cacheData)
        cache.set('parent', group)
        group.get('caches').pushObject(cache)

      result = []
      for branch, caches of groups
        result.push caches

      result
    )

Travis.CachesRoute = Route
