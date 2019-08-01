import Component from '@ember/component';
import { computed } from '@ember/object';
import { assert } from '@ember/debug';

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
  [COLORS.BLUE]: COLORS.BLUE,
  inactive: 'grey-300',
};

// Component definition
export default Component.extend({

  // Public interface
  tagName: '',
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

  activeBgColor: computed('color', function () {
    return BG_COLORS[this.color];
  }),
  inactiveBgColor: computed(() => BG_COLORS['inactive']),

  // Lifecycle
  init() {
    this._super(...arguments);
    assert(`Size "${this.size}" is not allowed on this component`, Object.values(SIZES).includes(this.size));
  },

  // Actions
  actions: {
    handleClick() {
      return this.onClick(!this.active);
    }
  }
});
