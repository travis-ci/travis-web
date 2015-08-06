`import Ember from 'ember'`

ShowMoreButtonComponent = Ember.Component.extend
  tagName: 'button'
  classNames: ['button button--grey button--showmore']
  classNameBindings: ['isLoading', 'showMore']
  showMore: true
  attributeBindings: ['disabled']

  disabledBinding: 'isLoading'

  buttonLabel: (->
    if @get('isLoading') then 'Loading' else 'Show more'
  ).property('isLoading')

  click: ->
    this.attrs.showMore()

`export default ShowMoreButtonComponent`
