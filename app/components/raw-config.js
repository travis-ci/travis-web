import Component from '@ember/component';
import { computed } from '@ember/object';
import { later } from '@ember/runloop';

export default Component.extend({
  copied: false,

  buttonLabel: computed('copied', function () {
    return this.get('copied') ? 'Copied!' : 'Copy to clipboard';
  }),

  actions: {
    copied() {
      this.set('copied', true);
      later(() => this.set('copied', false), 3000);
    }
  }
});
