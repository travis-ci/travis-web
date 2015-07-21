`import Ember from 'ember'`

SettingsController = Ember.Controller.extend
  envVars: Ember.computed.filterBy('model.envVars', 'isNew', false)

  actions:
    sshKeyAdded: (sshKey) ->
      @set('model.customSshKey', sshKey)
`export default SettingsController`
