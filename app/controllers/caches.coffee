`import Ember from 'ember'`

Controller = Ember.Controller.extend
  ajax: Ember.inject.service()

  repoController: Ember.inject.controller('repo')
  repo: Ember.computed.alias('repoController.repo')

  isDeleting: false

  cachesExist: (->
    @get('model.pushes.length') || @get('model.pullRequests.length')
  ).property('model.pushes.length', 'model.pullRequests.length')

  actions:
    deleteRepoCache: ->
      return if @get('isDeleting')

      if confirm('Are you sure?')
        @set('isDeleting', true)

        deletingDone = => @set('isDeleting', false)

        repo = @get('repo')
        @get('ajax').ajax("/repos/#{@get('repo.id')}/caches", "DELETE").then(deletingDone, deletingDone).then =>
          @set('model', {})

`export default Controller`
