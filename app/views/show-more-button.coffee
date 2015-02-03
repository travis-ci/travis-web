`import Ember from 'ember'`

View = Ember.View.extend
  tagName: 'button'
  classNameBindings: ['isLoading', 'showMore']
  showMore: true
  attributeBindings: ['disabled']
  isLoadingBinding: 'controller.isLoading'
  templateName: 'show-more-button'

  disabledBinding: 'isLoading'

  label: (->
    if @get('isLoading') then 'Loading' else 'Show more'
  ).property('isLoading')

  click: ->
    @get('controller').showMore()

`export default View`
