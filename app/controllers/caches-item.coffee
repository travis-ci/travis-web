Ajax = Travis.ajax

Controller = Ember.ObjectController.extend
  isDeleting: false
  needs: ['repo', 'caches']
  repo: Ember.computed.alias('controllers.repo.repo')

  actions:
    delete: ->
      return if @get('isDeleting')

      if confirm('Are you sure?')
        @set('isDeleting', true)

        data = { branch: @get('branch'), match: @get('slug') }

        deletingDone = => @set('isDeleting', false)

        repo = @get('repo')
        Ajax("/repos/#{repo.get('id')}/caches", "DELETE", data: data).then(deletingDone, deletingDone).then =>
          model = @get('model')
          @get('parent.caches').removeObject(model)
          if @get('parent.caches.length') == 0
            @get('controllers.caches').removeObject(@get('parent'))

Travis.CacheItemController = Controller
