import Component from '@ember/component';
import { computed } from '@ember/object';
import { or } from '@ember/object/computed';

export default Component.extend({
  tagName: '',

  // Public interface
  tag: 'div',
  grid: null,
  base: null,
  sm: null,
  md: null,
  lg: null,
  xl: null,

  // Private
  sizePrefix: computed('grid.isCol', function () {
    return this.grid.isCol ? 'h' : 'w';
  }),

  currentBase: or('base', 'grid.base'),
  currentSm: or('sm', 'grid.sm'),
  currentMd: or('md', 'grid.md'),
  currentLg: or('lg', 'grid.lg'),
  currentXl: or('xl', 'grid.xl'),

  baseClass: computed('sizePrefix', 'currentBase', function () {
    const val = this.currentBase;
    if (typeof val === 'string') {
      return val;
    }
    if (typeof val === 'number') {
      return `${this.sizePrefix}-1/${val}`.replace('1/1', 'full');
    }
    return '';
  }),

  smClass: computed('sizePrefix', 'currentSm', function () {
    const val = this.currentSm;
    if (typeof val === 'string') {
      return `sm:${val}`;
    }
    if (typeof val === 'number') {
      return `sm:${this.sizePrefix}-1/${val}`.replace('1/1', 'full');
    }
    return '';
  }),

  mdClass: computed('sizePrefix', 'currentMd', function () {
    const val = this.currentMd;
    if (typeof val === 'string') {
      return `md:${val}`;
    }
    if (typeof val === 'number') {
      return `md:${this.sizePrefix}-1/${val}`.replace('1/1', 'full');
    }
    return '';
  }),

  lgClass: computed('sizePrefix', 'currentLg', function () {
    const val = this.currentLg;
    if (typeof val === 'string') {
      return `lg:${val}`;
    }
    if (typeof val === 'number') {
      return `lg:${this.sizePrefix}-1/${val}`.replace('1/1', 'full');
    }
    return '';
  }),

  xlClass: computed('sizePrefix', 'currentXl', function () {
    const val = this.currentXl;
    if (typeof val === 'string') {
      return `xl:${val}`;
    }
    if (typeof val === 'number') {
      return `xl:${this.sizePrefix}-1/${val}`.replace('1/1', 'full');
    }
    return '';
  }),
});
