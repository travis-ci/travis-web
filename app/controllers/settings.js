import Ember from 'ember';
import config from 'travis/config/environment';

export default Ember.Controller.extend({
  envVars: Ember.computed.filterBy('model.envVars', 'isNew', false),

  actions: {
    sshKeyAdded(sshKey) {
      return this.set('model.customSshKey', sshKey);
    },

    sshKeyDeleted() {
      return this.set('model.customSshKey', null);
    }
  }
});
