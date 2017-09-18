import Ember from 'ember';
import { computed } from 'ember-decorators/object';

export default Ember.Component.extend({
  @computed('numbers')
  individualDigits(numbers) {
    return numbers.toString().split('');
  },
});
