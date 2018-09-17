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
    let query = {
      limit: 30
    };

    if (params.page) {
      query.offset = 30 * (params.page - 1);
    }

    return this.store.filter('build', query, build => build.get('createdBy.id') == currentUserId);
  },
});
