`import Ember from 'ember'`

View = Ember.TextArea.extend
  click: ->
    @get('element').select()

`export default View`
