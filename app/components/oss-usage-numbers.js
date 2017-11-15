import Component from '@ember/component';
import { computed } from 'ember-decorators/object';

export default Component.extend({
  @computed('numbers')
  individualDigits(numbers) {
    return numbers.toString().split('');
  },
});
