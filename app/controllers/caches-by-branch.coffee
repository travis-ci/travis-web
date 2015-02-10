`import Ember from 'ember'`
`import Ajax from 'travis/utils/ajax'`

Controller = Ember.ObjectController.extend
  isDeleting: false
  needs: ['repo', 'caches']
  repo: Ember.computed.alias('controllers.repo.repo')

  actions:
    delete: ->
      return if @get('isDeleting')

      if confirm('Are you sure?')
        @set('isDeleting', true)

        data = { branch: @get('branch') }

        deletingDone = => @set('isDeleting', false)

        repo = @get('repo')
        Ajax.ajax("/repos/#{repo.get('id')}/caches", "DELETE", data: data).then(deletingDone, deletingDone).then =>
          model = @get('model')
          @get('controllers.caches').removeObject(model)

Travis.CachesByBranchController = Controller
`export default Controller`
