import { Serializer } from 'miragejs';
import { isArray } from '@ember/array';

export default Serializer.extend({
  serialize(object) {
    if (isArray(object.models)) {
      return {
        '@type': 'preferences',
        '@href': '/v3/preferences',
        '@representation': 'standard',
        preferences: object.models.map(preference => preference.attrs)
      };
    } else {
      let metadata = {
        '@type': 'preference',
        '@href': '/v3/preferences',
        '@representation': 'standard'
      };
      return Object.assign(metadata, object.attrs);
    }
  }
});
