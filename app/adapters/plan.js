import V3Adapter from 'travis/adapters/v3';
import { inject as service } from '@ember/service';
import { reads } from '@ember/object/computed';

export default V3Adapter.extend({
  accounts: service(),
  account: reads('accounts.user'),

  buildURL(modelName, id, snapshot, requestType) {
    const url = this._super(...arguments);
    let route = '/plans_for/user';
    if (this.account.type === 'organization') {
      route = `/plans_for/organization/${this.account.id}`;
    }
    return url + route;
  },

  findAll(store, type) {
    let url = this.buildURL();
    return this.ajax(url, 'GET');
  }
});
