import ApplicationAdapter from 'travis/adapters/application';
import { underscore } from '@ember/string';

export default ApplicationAdapter.extend({
  namespace: 'settings',

  urlPrefix() {
    const prefix = this._super(...arguments);

    if (prefix.indexOf('http') === -1) {
      return `/${prefix}`;
    } else {
      return prefix;
    }
  },

  pathForType(type) {
    return underscore(type);
  },

  createRecord(store, type, record) {
    const data = {};
    const serializer = store.serializerFor(type.modelName);
    serializer.serializeIntoHash(data, type, record, {
      includeId: true
    });

    const url = `${this.urlPrefix()}/ssh_key/${record.id}`;
    return this.ajax(url, 'PATCH', { data });
  },
});
