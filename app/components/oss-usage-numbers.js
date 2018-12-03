import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  individualDigits: computed('numbers', function () {
    return this.get('numbers').toString().split('');
  })
});
