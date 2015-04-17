`import Ember from 'ember'`
`import Ajax from 'travis/utils/ajax'`

Controller = Ember.Controller.extend
  isDeleting: false

  actions:
    deleteRepoCache: ->
      return if @get('isDeleting')

      if confirm('Are you sure?')
        @set('isDeleting', true)

        deletingDone = => @set('isDeleting', false)

        repo = @get('repo')
        Ajax.ajax("/repos/#{repo.get('id')}/caches", "DELETE").then(deletingDone, deletingDone).then =>
          @set('model', {})

`export default Controller`
