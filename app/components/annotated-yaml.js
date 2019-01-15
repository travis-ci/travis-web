import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: '',

  copied: false,

  buttonLabel: computed('copied', function () {
    let copied = this.get('copied');
    if (copied) {
      return 'Copied!';
    } else {
      return 'Copy .travis.yml';
    }
  }),

  actions: {
    copied() {
      this.set('copied', true);
    }
  }
});
