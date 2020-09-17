import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  total: computed('selectedAddon', function () {
    return this.selectedAddon.price;
  })
});
