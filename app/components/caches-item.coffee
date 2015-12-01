`import Ember from 'ember'`
`import Ajax from 'travis/utils/ajax'`

CachesItemComponent = Ember.Component.extend

  tagName: 'li'
  classNames: ['cache-item']
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
        Ajax.ajax("/repos/#{repo.get('id')}/caches", "DELETE", data: data).then(deletingDone, deletingDone).then =>
          @get('caches').removeObject(@get('cache'))


`export default CachesItemComponent`
