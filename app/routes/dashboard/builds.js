import TravisRoute from 'travis/routes/basic';
import { inject as service } from '@ember/service';

export default TravisRoute.extend({
  auth: service(),

  model() {
    let currentUserId = this.get('auth.currentUser.id');
    let eventTypes = ['api', 'pull_request', 'push'];
    let query = {
      limit: 30,
      event_type: eventTypes.join(','),
      include: 'build.jobs'
    };

    return this.store.filter('build', query, ({ createdBy, eventType }) => (
      createdBy.get('id') == currentUserId && eventTypes.includes(eventType)
    ));
  },
});
