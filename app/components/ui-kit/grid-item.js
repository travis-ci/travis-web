import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNameBindings: ['baseClass', 'smClass', 'mdClass', 'lgClass', 'xlClass'],

  // Public interface
  grid: null,

  // Private
  sizePrefix: computed('grid.isCol', function () {
    return this.grid.isCol ? 'h' : 'w';
  }),

  baseClass: computed('sizePrefix', 'base', 'grid.base', function () {
    const val = this.base || this.grid.base;
    if (typeof val === 'string') {
      return val;
    }
    if (typeof val === 'number') {
      return `${this.sizePrefix}-1/${val}`.replace('1/1', 'full');
    }
    return '';
  }),

  smClass: computed('sizePrefix', 'sm', 'grid.sm', function () {
    const val = this.sm || this.grid.sm;
    if (typeof val === 'string') {
      return `sm:${val}`;
    }
    if (typeof val === 'number') {
      return `sm:${this.sizePrefix}-1/${val}`.replace('1/1', 'full');
    }
    return '';
  }),

  mdClass: computed('sizePrefix', 'md', 'grid.md', function () {
    const val = this.md || this.grid.md;
    if (typeof val === 'string') {
      return `md:${val}`;
    }
    if (typeof val === 'number') {
      return `md:${this.sizePrefix}-1/${val}`.replace('1/1', 'full');
    }
    return '';
  }),

  lgClass: computed('sizePrefix', 'lg', 'grid.lg', function () {
    const val = this.lg || this.grid.lg;
    if (typeof val === 'string') {
      return `lg:${val}`;
    }
    if (typeof val === 'number') {
      return `lg:${this.sizePrefix}-1/${val}`.replace('1/1', 'full');
    }
    return '';
  }),

  xlClass: computed('sizePrefix', 'xl', 'grid.xl', function () {
    const val = this.xl || this.grid.xl;
    if (typeof val === 'string') {
      return `xl:${val}`;
    }
    if (typeof val === 'number') {
      return `xl:${this.sizePrefix}-1/${val}`.replace('1/1', 'full');
    }
    return '';
  }),
});
