`import Ember from 'ember'`

Component = Ember.Component.extend

  classNames: ["sync-button"]
  actions: {
    sync: ->
      @get('user').sync()
  }

`export default Component`
