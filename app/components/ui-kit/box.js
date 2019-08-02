import Component from '@ember/component';
import { checkDictionary } from 'travis/utils/ui-kit/assertions';
import spacingMixin from 'travis/mixins/ui-kit/spacing';

const DISPLAYS = {
  BLOCK: 'block',
  INLINE_BLOCK: 'inline-block',
  FLEX: 'flex',
};

export default Component.extend(spacingMixin, {
  tagName: '',

  // Public interface
  tag: 'div',
  display: null,
  margin: null,

  // Lifecycle
  init() {
    this._super(...arguments);

    checkDictionary(this.display, DISPLAYS, 'Display', 'Box');
  },
});
