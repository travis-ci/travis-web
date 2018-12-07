import { Serializer } from 'ember-cli-mirage';
import { isArray } from '@ember/array';
import { assign } from '@ember/polyfills';

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
      return assign(metadata, object.attrs);
    }
  }
});
