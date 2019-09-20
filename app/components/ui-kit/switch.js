import Component from '@ember/component';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import { checkDictionary } from 'travis/utils/ui-kit/assertions';

// Size definitions
const SIZES = {
  MD: 'md',
};
const DEFAULT_SIZE = SIZES.MD;

const DOT_SIZES = {
  [SIZES.MD]: 4,
};

const SPACE_SIZES = {
  [SIZES.MD]: 5,
};

// Color definitions
const COLORS = {
  BLUE: 'blue-300',
};
const DEFAULT_COLOR = COLORS.BLUE;

const BG_COLORS = {
  inactive: 'grey-300',
};

// Component definition
export default Component.extend({
  tagName: '',

  // Public interface
  active: false,
  disabled: false,
  size: DEFAULT_SIZE,
  color: DEFAULT_COLOR,

  onClick() {},

  // Private
  dotSize: computed('size', function () {
    return DOT_SIZES[this.size];
  }),
  spaceSize: computed('size', function () {
    return SPACE_SIZES[this.size];
  }),

  activeBgColor: reads('color'),
  inactiveBgColor: computed(() => BG_COLORS['inactive']),

  // Lifecycle
  didReceiveAttrs() {
    this._super(...arguments);

    checkDictionary(this.color, COLORS, '@color', 'Switch');
    checkDictionary(this.size, SIZES, '@size', 'Switch');
  },

  // Actions
  actions: {
    handleClick() {
      return this.onClick(!this.active);
    }
  }
});
