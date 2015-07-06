`import Ember from 'ember'`
`import Polling from 'travis/mixins/polling'`

ReposListItemComponent = Ember.Component.extend Polling,
  pollModels: 'repo'

  classNames: ['repo']
  classNameBindings: ['selected']
  selected: (->
    @get('repo') == @get('selectedRepo')
  ).property('repo', 'selectedRepo')

  click: ->
    # TODO: don't use container
    @container.lookup('controller:repos').transitionToRoute('/' + @get('repo.slug'))

`export default ReposListItemComponent`
