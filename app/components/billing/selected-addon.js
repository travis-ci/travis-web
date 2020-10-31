import Component from '@ember/component';
import { reads } from '@ember/object/computed';

export default Component.extend({
  total: reads('selectedAddon.price')
});
