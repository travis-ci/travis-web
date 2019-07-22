import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  isNew: computed('subscription', function () {
    return !this.subscription;
  })
});
