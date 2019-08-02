import Component from '@ember/component';
import { checkDictionary } from 'travis/utils/ui-kit/assertions';

const DISPLAYS = {
  BLOCK: 'block',
  INLINE_BLOCK: 'inline-block',
  FLEX: 'flex',
};

export default Component.extend({

  // Public interface
  tag: 'div',
  display: null,

  // Lifecycle
  init() {
    this._super(...arguments);

    checkDictionary(this.display, DISPLAYS, 'Display', 'Box');
  },
});
