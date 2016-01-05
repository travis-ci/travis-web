import BasicView from 'travis/views/basic';
import Polling from 'travis/mixins/polling';

export default BasicView.extend(Polling, {
  pollHook: function(store) {
    var contentType, repositoryId;
    contentType = this.get('controller.contentType');
    repositoryId = this.get('controller.repo.id');
    store = this.get('controller.store');
    if (contentType === 'builds') {
      return store.query('build', {
        event_type: 'push',
        repository_id: repositoryId
      });
    } else if (contentType === 'pull_requests') {
      return store.filter('build', {
        event_type: 'pull_request',
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
