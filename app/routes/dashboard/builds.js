import TravisRoute from 'travis/routes/basic';
import { service } from 'ember-decorators/service';

export default TravisRoute.extend({
  @service auth: null,

  model(params) {
    let currentUserId = this.get('auth.currentUser.id');
    let query = {};

    return this.store.filter('build', query, build => build.get('createdBy.id') == currentUserId);
  },
});
