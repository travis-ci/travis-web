import TravisRoute from 'travis/routes/basic';
import { service } from 'ember-decorators/service';

export default TravisRoute.extend({
  @service auth: null,

  model(params) {
    let currentUserId = this.get('auth.currentUser.id');
    let eventTypes = ['api', 'pull_request', 'push'];
    let query = {
      limit: 30,
      event_type: eventTypes.join(',')
    };

    return this.store.filter('build', query, build =>
      build.get('createdBy.id') == currentUserId && eventTypes.includes(build.get('eventType')));
  },
});
