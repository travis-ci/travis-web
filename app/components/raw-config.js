import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  copied: false,

  buttonLabel: computed('copied', function () {
    let copied = this.get('copied');
    if (copied) {
      return 'Copied!';
    }
    return 'Copy to clipboard';
  }),

  actions: {
    copied() {
      this.set('copied', true);
    }
  }
});
