import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  isMultipleImages: computed('images.@each', function () {
    return this.images.length > 1;
  }),
});
