import { Serializer } from 'ember-cli-mirage';
import { decamelize } from '@ember/string';

export default Serializer.extend({
  serialize(object) {

    const decaamelizedAttrs = Object.keys(object.attrs)
      .reduce((attrs, key) => {
        const decamelizedKey = decamelize(key);
        attrs[decamelizedKey] = object.attrs[key];
        return attrs;
      }, {});

    return {
      '@type': 'coupon',
      '@representation': 'standard',
      ...decaamelizedAttrs
    };
  },
});
