import Component from '@ember/component';
import { computed } from '@ember/object';
import { BREAKPOINTS } from 'travis/components/styleguides/grid-container';

const breakpointClasses = BREAKPOINTS.map((val) => `${val}Class`);

export default Component.extend({
  classNameBindings: ['baseClass', ...breakpointClasses],

  grid: null,

  sizePrefix: computed('grid.dir', function () {
    return this.grid.dir.includes('col') ? 'h' : 'w';
  }),

  base: computed('grid.base', function () {
    const { base } = this.grid;
    return base === 1 ? 'full' : `1/${base}`;
  }),
  baseClass: computed('base', 'sizePrefix', function () {
    return `${this.sizePrefix}-${this.base}`;
  }),

  ...BREAKPOINTS.reduce((props, breakpoint) => {
    props[breakpoint] = computed(`grid.${breakpoint}`, function () {
      const gridVal = this.grid[breakpoint];
      return gridVal === 1 ? 'full' : `1/${gridVal}`;
    });
    props[`${breakpoint}Class`] = computed(breakpoint, 'sizePrefix', function () {
      const size = this[breakpoint];
      const sizeClass = ['full', '1/1'].includes(size) ? 'full' : size;
      return `${breakpoint}:${this.sizePrefix}-${sizeClass}`;
    });
    return props;
  }, {}),
});
