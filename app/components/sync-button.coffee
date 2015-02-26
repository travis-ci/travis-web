`import Ember from 'ember'`

Component = Ember.Component.extend
  actions: {
    sync: ->
        console.log(@get('user'));
  }
  

`export default Component`
