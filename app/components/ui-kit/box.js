import Component from '@ember/component';
import { checkDictionary } from 'travis/utils/ui-kit/assertions';
import spacingMixin from 'travis/mixins/ui-kit/spacing';
import { reads } from '@ember/object/computed';

const DISPLAYS = {
  BLOCK: 'block',
  INLINE_BLOCK: 'inline-block',
  FLEX: 'flex',
};

const POSITIONS = {
  STATIC: 'static',
  FIXED: 'fixed',
  ABSOLUTE: 'absolute',
  RELATIVE: 'relative',
  STICKY: 'sticky',
};

export default Component.extend(spacingMixin, {
  tagName: '',

  // Public interface
  tag: 'div',
  display: null,
  position: null,
  margin: null,

  // Private
  displayClass: reads('display'),
  positionClass: reads('position'),

  // Lifecycle
  init() {
    this._super(...arguments);

    checkDictionary(this.display, DISPLAYS, 'Display', 'Box');
    checkDictionary(this.position, POSITIONS, 'Position', 'Box');
  },
});
