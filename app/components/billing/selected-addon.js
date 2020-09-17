import Component from '@ember/component';
import { computed, reads } from '@ember/object';

export default Component.extend({
  total: reads('selectedAddon.price')
});
