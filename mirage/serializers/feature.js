import Ember from 'ember';
import { Serializer } from 'ember-cli-mirage';

export default Serializer.extend({
  serialize(object) {
    if (Ember.isArray(object.models)) {
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
      return Ember.merge(metadata, object.attrs);
    }
  }
});
