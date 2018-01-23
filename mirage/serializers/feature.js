import { Serializer } from 'ember-cli-mirage';
import { isArray } from '@ember/array';
import { merge } from '@ember/polyfills';

export default Serializer.extend({
  serialize(object) {
    if (isArray(object.models)) {
      return {
        '@type': 'features',
        '@href': '/features',
        '@representation': 'standard',
        features: object.models.map(feature => feature.attrs)
      };
    } else {
      let metadata = {
        '@type': 'features',
        '@href': '/features',
        '@representation': 'standard'
      };
      return merge(metadata, object.attrs);
    }
  }
});
