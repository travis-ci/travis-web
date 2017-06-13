import Ember from 'ember';
import TravisRoute from 'travis/routes/basic';
import PaginatedCollectionPromise from 'travis/utils/paginated-collection-promise';

export default TravisRoute.extend({
  queryParams: {
    filter: {
      replace: true
    },
    offset: {
      refreshModel: true
    }
  },

  redirect() {
    if (!this.get('features.dashboard')) {
      return this.transitionTo('index');
    }
  },

  model(params) {
    let collection = PaginatedCollectionPromise.create({
      content: this.store.query('repo', {
        active: true,
        sort_by: 'current_build:desc',
        offset: params.offset
      }),
    });
    return Ember.RSVP.hash({
      repos: collection,
      accounts: this.store.query('account', {
        all: true
      })
    });
  }
});
