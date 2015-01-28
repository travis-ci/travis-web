Travis.EnvVarsController = Ember.ArrayController.extend
  vars: Ember.computed.filterBy('model', 'isNew', false)
