`import Ember from 'ember'`

Component = Ember.Component.extend

  actions:
    toggleOrgFilter: () ->
      @toggleProperty('showFilter')
      false
    select: (org) ->
      @toggleProperty('showFilter')
      @sendAction('action', org)

`export default Component`
