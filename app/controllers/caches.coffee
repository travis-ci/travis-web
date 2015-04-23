`import Ember from 'ember'`
`import Ajax from 'travis/utils/ajax'`

Controller = Ember.Controller.extend
  needs: ['repo']
  repo: Ember.computed.alias('controllers.repo.repo')

  isDeleting: false

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
