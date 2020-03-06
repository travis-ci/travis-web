import Service, { inject as service } from '@ember/service';
import { filterBy } from '@ember/object/computed';

export default Service.extend({
  store: service(),

  init() {
    this.set('builds', this.store.peekAll('build'));
    return this._super(...arguments);
  },

  pullRequests: filterBy('builds', 'eventType', 'pull_request'),
});
