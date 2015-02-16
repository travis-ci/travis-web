`import Ember from 'ember'`

Controller = Ember.ArrayController.extend
  vars: Ember.computed.alias('model')

`export default Controller`
