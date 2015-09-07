`import Ember from 'ember'`

FlashItemComponent = Ember.Component.extend
  tagName: 'li'
  classNameBindings: ['type']

  type: (->
    @get('flash.type') || 'broadcast'
  ).property('flash.type')

  actions:
    close: ->
      this.attrs.close(@get('flash'))

`export default FlashItemComponent`
