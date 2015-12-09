`import Ember from 'ember'`
`import TravisRoute from 'travis/routes/basic'`

Route = TravisRoute.extend
  ajax: Ember.inject.service()

  needsAuth: true
  setupController: (controller) ->
    @_super.apply this, arguments
    @controllerFor('repo').activate('caches')

  model: ->
    repo = @modelFor('repo')
    @get('ajax').get("/repos/#{repo.get('id')}/caches").then( (data) ->
      caches = {}

      data["caches"].forEach (cacheData) ->
        branch = cacheData.branch
        cache = caches[branch]

        if cache
          cache.size += cacheData.size

          if cache.last_modified < cacheData.last_modified
            cache.last_modified = cacheData.last_modified
        else
          caches[branch] = cacheData

      pushes = []
      pullRequests = []


      for branch, cache of caches
        if /PR./.test(branch)
          cache.type = "pull_request"
          pullRequests.push cache
        else
          cache.type = "push"
          pushes.push cache

      {
        pushes: pushes,
        pullRequests: pullRequests
      }
    )

`export default Route`
