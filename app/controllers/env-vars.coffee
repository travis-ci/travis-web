`import Ember from 'ember'`

Controller = Ember.ArrayController.extend
  vars: Ember.computed.filterBy('model', 'isNew', false)

`export default Controller`
