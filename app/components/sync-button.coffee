`import Ember from 'ember'`

Component = Ember.Component.extend
  actions: {
    sync: ->
      @get('user').sync()
  }

`export default Component`
