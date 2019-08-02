import Component from '@ember/component';
import { checkDictionary, requireProp } from 'travis/utils/ui-kit/assertions';

export const TAGS = {
  DIV: 'div',
  SECTION: 'section',
  SPAN: 'span',
};
const DEFAULT_TAG = TAGS.DIV;

export default Component.extend({
  tagName: '',

  // Public interface
  tag: DEFAULT_TAG,
  class: '',

  // Lifecycle
  init() {
    this._super(...arguments);

    checkDictionary(this.tag, TAGS, 'Size', 'Font');
    requireProp(this.tag, 'Tag', 'Tag');
  },
});
