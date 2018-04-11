import TravisRoute from 'travis/routes/basic';
import { hash } from 'rsvp';

export default TravisRoute.extend({
  needsAuth: true,
  queryParams: {
    page: {
      refreshModel: true
    }
  },

  model(params) {
    const offset = (params.page - 1) * 100;

    return hash({
      user: this.store.findRecord('user', this.get('auth.currentUser.id')),
      organizations: this.store.paginated('organization', {
        role: 'admin',
        limit: 100,
        offset
      }, { live: false })
    });
  }
});
