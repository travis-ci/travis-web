import V3Adapter from 'travis/adapters/v3';
import { inject as service } from '@ember/service';

export default V3Adapter.extend({
  store: service(),

  buildURL: function (modelName, id, snapshot, requestType, query) {
    const prefix = this.urlPrefix();
    let provider;
    let login;
    if (query) {
      provider = query.provider;
      login = query.login;
      delete query.login;
      delete query.provider;
    } else {
      const owner = this.store.peekRecord('user', id) || this.store.peekRecord('organization', id);
      provider = owner.provider;
      login = owner.login;
    }
    const providerPrefix = provider ? `${provider}/` : '';
    return `${prefix}/owner/${providerPrefix}${login}/allowance`;
  },
});
