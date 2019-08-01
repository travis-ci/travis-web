import Component from '@ember/component';
import { assert } from '@ember/debug';

export const TAGS = {
  DIV: 'div',
  SECTION: 'section',
};
const DEFAULT_TAG = TAGS.DIV;
const SUPPORTED_TAGS = Object.values(TAGS);

export default Component.extend({
  tagName: '',

  // Public interface
  tag: DEFAULT_TAG,
  class: '',

  // Lifecycle
  init() {
    this._super(...arguments);
    assert(`Tag "${this.tag}" is not allowed on this component`, SUPPORTED_TAGS.includes(this.tag));
  },
});
