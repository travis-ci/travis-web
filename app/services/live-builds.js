import Service, { inject as service } from '@ember/service';
import { filterBy, sort } from '@ember/object/computed';

export default Service.extend({
  store: service(),

  init() {
    this.set('_builds', this.store.peekAll('build'));
    return this._super(...arguments);
  },

  unsortedPullRequests: filterBy('_builds', 'eventType', 'pull_request'),
  pullRequests: sort('unsortedPullRequests', (a, b) => a.number < b.number),
});
