import Component from '@ember/component';
import { computed } from 'ember-decorators/object';

export default Component.extend({
  tagName: '',

  copied: false,

  @computed('copied')
  buttonLabel(copied) {
    if (copied) {
      return 'Copied!';
    } else {
      return 'Copy .travis.yml';
    }
  },

  actions: {
    copied() {
      this.set('copied', true);
    }
  }
});
