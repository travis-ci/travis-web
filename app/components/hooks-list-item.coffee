`import Ember from 'ember'`

HooksListItemComponent = Ember.Component.extend
  tagName: 'li'
  classNames: ['row']
  classNameBindings: ['hook.active:active']
  actions:
    handleToggleError: ->
      @set("errorMessage", "There was an error")

`export default HooksListItemComponent`
