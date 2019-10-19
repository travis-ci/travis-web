import { Serializer } from 'ember-cli-mirage';

export default Serializer.extend({
  serialize(object) {
    return {
      '@type': 'coupon',
      '@representation': 'standard',
      ...object.attrs
    };
  },
});
