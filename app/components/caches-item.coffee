`import Ember from 'ember'`

CachesItemComponent = Ember.Component.extend
  ajax: Ember.inject.service()

  tagName: 'li'
  classNames: ['tile', 'tile--xs', 'row']
  classNameBindings: ['cache.type']
  isDeleting: false

  actions:
    delete: ->
      return if @get('isDeleting')

      if confirm('Are you sure?')
        @set('isDeleting', true)

        data = { branch: @get('cache.branch') }

        deletingDone = => @set('isDeleting', false)

        repo = @get('repo')
        @get('ajax').ajax("/repos/#{repo.get('id')}/caches", "DELETE", data: data).then(deletingDone, deletingDone).then =>
          @get('caches').removeObject(@get('cache'))


`export default CachesItemComponent`
