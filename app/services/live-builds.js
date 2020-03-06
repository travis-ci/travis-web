import Service, { inject as service } from '@ember/service';
import { filterBy, sort } from '@ember/object/computed';

export default Service.extend({
  store: service(),

  init() {
    this.set('builds', this.store.peekAll('build'));
    return this._super(...arguments);
  },

  sortedBuilds: sort('builds', (a, b) => a.number < b.number),

  pullRequests: filterBy('sortedBuilds', 'eventType', 'pull_request'),
});
