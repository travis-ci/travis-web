Controller = Ember.ArrayController.extend
  vars: Ember.computed.filterBy('model', 'isNew', false)

Travis.EnvVarsController = Controller
