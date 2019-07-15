import Component from '@ember/component';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import { BREAKPOINTS } from 'travis/components/styleguides/grid-container';

const breakpointClasses = BREAKPOINTS.map((val) => `${val}Class`);

const generateBreakpointClassFunc = function (breakpoint) {
  return function () {
    if (this[breakpoint] === null) {
      return null;
    }
    const { sizePrefix } = this;
    const size = this[`${breakpoint}Size`].replace('1/1', 'full');
    const bpPrefix = breakpoint === 'base' ? '' : `${breakpoint}:`;
    return `${bpPrefix}${sizePrefix}-${size}`;
  };
};

export default Component.extend({
  classNameBindings: ['baseClass', ...breakpointClasses],

  grid: null,

  sizePrefix: computed('grid.dir', function () {
    return this.grid.dir.includes('col') ? 'h' : 'w';
  }),

  base: reads('grid.base'),
  baseSize: computed('base', function () { return `1/${this.base}`; }),
  baseClass: computed('baseSize', 'sizePrefix', generateBreakpointClassFunc('base')),

  sm: reads('grid.sm'),
  smSize: computed('sm', function () { return `1/${this.sm}`; }),
  smClass: computed('smSize', 'sizePrefix', generateBreakpointClassFunc('sm')),

  md: reads('grid.md'),
  mdSize: computed('md', function () { return `1/${this.md}`; }),
  mdClass: computed('mdSize', 'sizePrefix', generateBreakpointClassFunc('md')),

  lg: reads('grid.lg'),
  lgSize: computed('lg', function () { return `1/${this.lg}`; }),
  lgClass: computed('lgSize', 'sizePrefix', generateBreakpointClassFunc('lg')),

  xl: reads('grid.xl'),
  xlSize: computed('xl', function () { return `1/${this.xl}`; }),
  xlClass: computed('xlSize', 'sizePrefix', generateBreakpointClassFunc('xl')),
});
