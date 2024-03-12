import { Serializer } from 'miragejs';
import { isArray } from '@ember/array';

export default Serializer.extend({
  serialize(object) {
    if (isArray(object.models)) {
      return {
        '@type': 'features',
        '@href': '/features',
        '@representation': 'standard',
        features: object.models.map((feature) => feature.attrs),
      };
    } else {
      let metadata = {
        '@type': 'features',
        '@href': '/features',
        '@representation': 'standard',
      };
      return Object.assign(metadata, object.attrs);
    }
  },
});
