import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';
import { none, collect, reads } from '@ember/object/computed';
import prefix from 'travis/utils/ui-kit/prefix';

export default Mixin.create({
  // Public interface //
  margin: null,
  padding: null,

  // Private //

  // Margins
  marginClasses: computed(
    'marginTop',
    'marginRight',
    'marginBottom',
    'marginLeft',
    'marginX',
    'marginY',
    'marginAll',
    function () {
      return `
        ${this.marginTop}
        ${this.marginRight}
        ${this.marginBottom}
        ${this.marginLeft}
        ${this.marginX}
        ${this.marginY}
        ${this.marginAll}
      `;
    }
  ),

  hasNoMarginTop: none('margin.top'),
  marginTop: computed('hasNoMarginTop', 'margin.top', function () {
    if (this.hasNoMarginTop) {
      return '';
    }

    const { top } = this.margin;
    const isNegative = typeof top === 'number' && top < 0;
    return isNegative ? `-mt${top}` : `mt-${top}`;
  }),
  hasNoMarginRight: none('margin.right'),
  marginRight: computed('hasNoMarginRight', 'margin.right', function () {
    if (this.hasNoMarginRight) {
      return '';
    }

    const { right } = this.margin;
    const isNegative = typeof right === 'number' && right < 0;
    return isNegative ? `-mr${right}` : `mr-${right}`;
  }),
  hasNoMarginBottom: none('margin.bottom'),
  marginBottom: computed('hasNoMarginBottom', 'margin.bottom', function () {
    if (this.hasNoMarginBottom) {
      return '';
    }

    const { bottom } = this.margin;
    const isNegative = typeof bottom === 'number' && bottom < 0;
    return isNegative ? `-mb${bottom}` : `mb-${bottom}`;
  }),
  hasNoMarginLeft: none('margin.left'),
  marginLeft: computed('hasNoMarginLeft', 'margin.left', function () {
    if (this.hasNoMarginLeft) {
      return '';
    }

    const { left } = this.margin;
    const isNegative = typeof left === 'number' && left < 0;
    return isNegative ? `-ml${left}` : `ml-${left}`;
  }),
  hasNoMarginX: none('margin.x'),
  marginX: computed('hasNoMarginX', 'margin.x', function () {
    if (this.hasNoMarginX) {
      return '';
    }

    const { x } = this.margin;
    const isNegative = typeof x === 'number' && x < 0;
    return isNegative ? `-mx${x}` : `mx-${x}`;
  }),
  hasNoMarginY: none('margin.y'),
  marginY: computed('hasNoMarginY', 'margin.y', function () {
    if (this.hasNoMarginY) {
      return '';
    }

    const { y } = this.margin;
    const isNegative = typeof y === 'number' && y < 0;
    return isNegative ? `-my${y}` : `my-${y}`;
  }),
  hasNoMarginAll: none('margin.all'),
  marginAll: computed('hasNoMarginAll', 'margin.all', function () {
    if (this.hasNoMarginAll) {
      return '';
    }

    const { all } = this.margin;
    const isNegative = typeof all === 'number' && all < 0;
    return isNegative ? `-m${all}` : `m-${all}`;
  }),

  // Padding
  paddingTop: prefix('padding.top', 'pt'),
  paddingRight: prefix('padding.right', 'pr'),
  paddingBottom: prefix('padding.bottom', 'pb'),
  paddingLeft: prefix('padding.left', 'pl'),
  paddingX: prefix('padding.x', 'px'),
  paddingY: prefix('padding.y', 'py'),
  paddingAll: prefix('padding.all', 'p'),

  paddingClasses: collect(
    'paddingTop',
    'paddingRight',
    'paddingBottom',
    'paddingLeft',
    'paddingX',
    'paddingY',
    'paddingAll',
  ),
  paddingClassText: computed('paddingClasses', function () {
    return this.paddingClasses.compact().join(' ');
  }),
});
