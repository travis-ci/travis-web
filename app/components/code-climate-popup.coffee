`import Ember from 'ember'`

Component = Ember.Component.extend(
  actions:
    close: ->
      $('.popup').removeClass('display')
      return false
)

`export default Component`
