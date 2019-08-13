import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';
import { none } from '@ember/object/computed';

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
  paddingClasses: computed(
    'paddingTop',
    'paddingRight',
    'paddingBottom',
    'paddingLeft',
    'paddingX',
    'paddingY',
    'paddingAll',
    function () {
      return `
        ${this.paddingTop}
        ${this.paddingRight}
        ${this.paddingBottom}
        ${this.paddingLeft}
        ${this.paddingX}
        ${this.paddingY}
        ${this.paddingAll}
      `;
    }
  ),

  hasNoPaddingTop: none('padding.top'),
  paddingTop: computed('hasNoPaddingTop', 'padding.top', function () {
    if (this.hasNoPaddingTop) {
      return '';
    }

    const { top } = this.padding;
    const isNegative = typeof top === 'number' && top < 0;
    return isNegative ? `-pt${top}` : `pt-${top}`;
  }),
  hasNoPaddingRight: none('padding.right'),
  paddingRight: computed('hasNoPaddingRight', 'padding.right', function () {
    if (this.hasNoPaddingRight) {
      return '';
    }

    const { right } = this.padding;
    const isNegative = typeof right === 'number' && right < 0;
    return isNegative ? `-pr${right}` : `pr-${right}`;
  }),
  hasNoPaddingBottom: none('padding.bottom'),
  paddingBottom: computed('hasNoPaddingBottom', 'padding.bottom', function () {
    if (this.hasNoPaddingBottom) {
      return '';
    }

    const { bottom } = this.padding;
    const isNegative = typeof bottom === 'number' && bottom < 0;
    return isNegative ? `-pb${bottom}` : `pb-${bottom}`;
  }),
  hasNoPaddingLeft: none('padding.left'),
  paddingLeft: computed('hasNoPaddingLeft', 'padding.left', function () {
    if (this.hasNoPaddingLeft) {
      return '';
    }

    const { left } = this.padding;
    const isNegative = typeof left === 'number' && left < 0;
    return isNegative ? `-pl${left}` : `pl-${left}`;
  }),
  hasNoPaddingX: none('padding.x'),
  paddingX: computed('hasNoPaddingX', 'padding.x', function () {
    if (this.hasNoPaddingX) {
      return '';
    }

    const { x } = this.padding;
    const isNegative = typeof x === 'number' && x < 0;
    return isNegative ? `-px${x}` : `px-${x}`;
  }),
  hasNoPaddingY: none('padding.y'),
  paddingY: computed('hasNoPaddingY', 'padding.y', function () {
    if (this.hasNoPaddingY) {
      return '';
    }

    const { y } = this.padding;
    const isNegative = typeof y === 'number' && y < 0;
    return isNegative ? `-py${y}` : `py-${y}`;
  }),
  hasNoPaddingAll: none('padding.all'),
  paddingAll: computed('hasNoPaddingAll', 'padding.all', function () {
    if (this.hasNoPaddingAll) {
      return '';
    }

    const { all } = this.padding;
    const isNegative = typeof all === 'number' && all < 0;
    return isNegative ? `-p${all}` : `p-${all}`;
  }),
});
