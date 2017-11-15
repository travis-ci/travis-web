import Component from '@ember/component';
import { computed } from 'ember-decorators/object';

export default Component.extend({
  tagName: '',

  @computed('digit')
  digitClass(digit) {
    return `oss-num-${digit}`;
  },
});
