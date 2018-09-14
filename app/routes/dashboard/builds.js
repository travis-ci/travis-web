import TravisRoute from 'travis/routes/basic';
import { service } from 'ember-decorators/service';

export default TravisRoute.extend({
  @service auth: null,

  queryParams: {
    page: {
      refreshModel: true
    },
  },

  model(params) {
    let currentUserId = this.get('auth.currentUser.id');

    return this.store.filter('build', {limit: 30}, build => build.get('createdBy.id') == currentUserId);
  },
});
