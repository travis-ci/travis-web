import Component from '@ember/component';
import { checkDictionary, requireProp } from 'travis/utils/ui-kit/assertions';

export const TAGS = {
  DIV: 'div',
  HEADER: 'header',
  SECTION: 'section',

  SPAN: 'span',
  H1: 'h1',
  H2: 'h2',
  H3: 'h3',
  H4: 'h4',
  H5: 'h5',
  H6: 'h6',
  P: 'p',
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

    checkDictionary(this.tag, TAGS, '@tag', 'Tag');
    requireProp(this.tag, '@tag', 'Tag');
  },
});
