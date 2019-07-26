import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: '',

  digitClass: computed('digit', function () {
    return `oss-num-${this.digit}`;
  }),
});
