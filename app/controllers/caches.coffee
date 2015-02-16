`import Ember from 'ember'`
`import Ajax from 'travis/utils/ajax'`

Controller = Ember.ArrayController.extend
  isDeleting: false
  needs: ['repo']
  repo: Ember.computed.alias('controllers.repo.repo')

  actions:
    deleteRepoCache: ->
      return if @get('isDeleting')

      if confirm('Are you sure?')
        @set('isDeleting', true)

        deletingDone = => @set('isDeleting', false)

        repo = @get('repo')
        Ajax.ajax("/repos/#{repo.get('id')}/caches", "DELETE").then(deletingDone, deletingDone).then =>
          @clear()

`export default Controller`
