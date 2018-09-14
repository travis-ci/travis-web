import TravisRoute from 'travis/routes/basic';
import { service } from 'ember-decorators/service';

export default TravisRoute.extend({
  @service auth: null,

  model(params) {
    let currentUserId = this.get('auth.currentUser.id');

    return this.store.filter('build', {}, build => build.get('createdBy.id') == currentUserId);
  },
});
