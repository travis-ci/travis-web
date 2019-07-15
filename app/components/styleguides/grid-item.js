import Component from '@ember/component';
import { computed } from '@ember/object';
import { or } from '@ember/object/computed';
import { BREAKPOINTS } from 'travis/components/styleguides/grid-container';

const breakpointClasses = BREAKPOINTS.map((val) => `${val}Class`);

const generateBreakpointClassFunc = function (breakpoint) {
  return function () {
    const { sizePrefix } = this;
    const bpVal = this[breakpoint];
    const size = bpVal === 1 ? 'full' : `1/${bpVal}`;
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

  defaultSize: 1,

  base: or('grid.base', 'defaultSize'),
  baseClass: computed('base', 'sizePrefix', generateBreakpointClassFunc('base')),

  sm: or('grid.sm', 'base'),
  smClass: computed('sm', 'sizePrefix', generateBreakpointClassFunc('sm')),

  md: or('grid.md', 'sm'),
  mdClass: computed('md', 'sizePrefix', generateBreakpointClassFunc('md')),

  lg: or('grid.lg', 'md'),
  lgClass: computed('lg', 'sizePrefix', generateBreakpointClassFunc('lg')),

  xl: or('grid.xl', 'lg'),
  xlClass: computed('xl', 'sizePrefix', generateBreakpointClassFunc('xl')),
});
