import Ember from 'ember';
import config from 'travis/config/environment';

const { service } = Ember.inject;
const { alias } = Ember.computed;

export default Ember.Component.extend({
  auth: service(),
  flashes: service(),

  user: alias('auth.currentUser'),

  canActivate: function() {
    let user = this.get('user');
    if(user) {
      let permissions = user.get('pushPermissions'),
          repoId = parseInt(this.get('repo.id'));

      return permissions.contains(repoId);
    } else {
      return false;
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
              repo = this.get('repo'),
              repoId = repo.get('id');

          let channel = 'repo-' + repoId;
          if(repo.get('private')) {
            channel = 'private-' + channel;
          }

          pusher.subscribe(channel);

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
