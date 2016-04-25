import Ember from 'ember';
import Polling from 'travis/mixins/polling';

const { service } = Ember.inject;

export default Ember.Component.extend({
  store: service(),

  pollHook: function(store) {
    var contentType, repositoryId;
    contentType = this.get('contentType');
    repositoryId = this.get('repo.id');
    store = this.get('store');

    if (contentType === 'builds') {
      return store.query('build', {
        event_type: ['push', 'cron'],
        repository_id: repositoryId
      });
    } else if (contentType === 'pull_requests') {
      return store.filter('build', {
        event_type: 'pull_request',
        repository_id: repositoryId
      });
    } else if (contentType === 'crons') {
      return store.filter('build', {
        event_type: 'cron',
        repository_id: repositoryId
      });
    } else {
      return store.query('build', {
        repository_id: repositoryId,
        branches: true
      });
    }
  }
});
