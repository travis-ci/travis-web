`import Ember from 'ember'`
`import TravisRoute from 'travis/routes/basic'`
`import Ajax from 'travis/utils/ajax'`

Route = TravisRoute.extend
  needsAuth: true
  setupController: ->
    @_super.apply this, arguments
    @controllerFor('repo').activate('caches')

  model: ->
    repo = @modelFor('repo')
    Ajax.get("/repos/#{repo.get('id')}/caches").then( (data) ->
      groups = {}
      counter = 1
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

`export default Route`
