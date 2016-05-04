import Ember from 'ember';
import config from 'travis/config/environment';

const { service } = Ember.inject;

export default Ember.Component.extend({
  flashes: service(),

  canActivate: function() {
    let user = this.get('user');
    if(user) {
      let permissions = user.get('pushPermissions'),
          repoId = parseInt(this.get('repo.id'));

      return permissions.contains(repoId);
    }
  }.property('user.pushPermissions.[]', 'repo'),

  actions: {
    activate: function() {
      let apiEndpoint = config.apiEndpoint,
          repoId = this.get('repo.id');

      this.set('isActivating', true);
      $.ajax(apiEndpoint + '/v3/repo/' + repoId + '/enable', {
        headers: {
          Authorization: 'token ' + this.get('auth').token()
        },
        method: 'POST'
      }).then((response) => {
        if(response.active) {
          let pusher = this.get('pusher'),
              repoId = this.get('repo.id');

          pusher.subscribe('repo-' + repoId);

          this.get('repo').set('active', true);

          this.get('flashes').success('Repository has been successfully activated.');
        }
        this.set('isActivating', false);
      }, () => {
        this.set('isActivating', false);
        this.get('flashes').error('There was an error while trying to activate the repository.');
      });
    }
  }
});
