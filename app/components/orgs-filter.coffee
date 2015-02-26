`import Ember from 'ember'`

Component = Ember.Component.extend

  actions: {
    select: (org) ->
      @sendAction('action', org)
  }

`export default Component`
