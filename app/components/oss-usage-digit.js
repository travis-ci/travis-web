import Ember from 'ember';
import { computed } from 'ember-decorators/object';

export default Ember.Component.extend({
  tagName: '',

  @computed('digit')
  digitClass(digit) {
    return `oss-num-${digit}`;
  },
});
