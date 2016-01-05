import Ember from 'ember';
import config from 'travis/config/environment';

export default Ember.Component.extend({
  actions: {
    triggerBuild() {
      var apiEndpoint;
      this.set('isLoading', true);
      apiEndpoint = config.apiEndpoint;
      return $.ajax(apiEndpoint + ("/v3/repo/" + (this.get('repo.repo.id')) + "/requests"), {
        headers: {
          Authorization: 'token ' + this.get('repo.auth')
        },
        type: "POST"
      }).then(() => {
        return this.set('isLoading', false);
      });
    }
  }
});
