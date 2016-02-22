import Ember from 'ember';
import config from 'travis/config/environment';

export default Ember.Controller.extend({
  envVars: Ember.computed.filterBy('model.envVars', 'isNew', false),

  crons: function() {
    var result, apiEndpoint, options, repoId;
    apiEndpoint = config.apiEndpoint;
    repoId = this.get('repo.id');
    result = Ember.ArrayProxy.create();
    options = {};
    if (this.get('auth.signedIn')) {
      options.headers = {
        Authorization: "token " + (this.auth.token())
      };
    }
    $.ajax(apiEndpoint + "/v3/repo/" + repoId + "/crons", options).then(function(response) {
      return result.set('content', response.crons);
    });
    return result;
  }.property('repo'),

  actions: {
    sshKeyAdded(sshKey) {
      return this.set('model.customSshKey', sshKey);
    },

    sshKeyDeleted() {
      return this.set('model.customSshKey', null);
    }
  }
});
