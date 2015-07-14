`import Ember from 'ember'`

SettingsController = Ember.Controller.extend

  envVars: Ember.computed.filterBy('model.envVars', 'isNew', false)

`export default SettingsController`
