`import Ember from 'ember'`
`import Ajax from 'travis/utils/ajax'`

Controller = Ember.Controller.extend
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
        Ajax.ajax("/repos/#{@get('repo.id')}/caches", "DELETE").then(deletingDone, deletingDone).then =>
          @set('model', {})

`export default Controller`
