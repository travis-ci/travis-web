import Ember from 'ember';
import { alias } from 'ember-decorators/object/computed';

export default Ember.Component.extend({
  tagName: 'nav',
  classNames: ['pagination-navigation'],
  @alias('collection.pagination') pagination: null,

  outerWindow: Ember.computed('outer', function () {
    return this.get('outer') || 1;
  }),
  innerWindow: Ember.computed('inner', function () {
    return this.get('inner') || 2;
  }),

  pages: Ember.computed('pagination.numberOfPages', function () {
    let numberOfPages = this.get('pagination.numberOfPages');
    let thresholdDisplayAll = ((this.get('outerWindow') + 1) * 2) + (this.get('innerWindow') + 1);
    let pageArray = [];

    // display all pages if there is only a few
    if (numberOfPages <= thresholdDisplayAll) {
      for (let i = 0; i < numberOfPages; i++) {
        pageArray.push({
          num: i + 1,
          offset: this.get('pagination.perPage') * i
        });
      }
    // else stack together pagination
    } else {
      let currentPage = this.get('pagination.currentPage');
      let currentOffset = this.get('pagination.offset');
      let innerWindow = this.get('innerWindow');
      let outerWindow = this.get('outerWindow');
      let innerHalf = Math.ceil(innerWindow / 2);
      let lowerInnerBoundary = currentPage - innerHalf;
      if (lowerInnerBoundary < 0) {
        lowerInnerBoundary = 0;
      }
      let upperInnerBoundary = currentPage + innerHalf;
      let lowerOuterBoundary = 1 + outerWindow;
      let upperOuterBoundary = numberOfPages - outerWindow;

      pageArray.push({
        num: 1,
        offset: 0
      });
      // outerwindow first page
      for (let i = 1; i <= outerWindow; i++) {
        if (i !== currentPage) {
          pageArray.push({
            num: 1 + i,
            offset: this.get('pagination.perPage') * i
          });
        }
      }

      // ... devider unit
      if (lowerInnerBoundary - pageArray.length > outerWindow) {
        pageArray.push({});
      }

      // innerwindow < current page
      for (let i = lowerInnerBoundary; i < currentPage; i++) {
        if (i > lowerOuterBoundary) {
          pageArray.push({
            num: i,
            offset: (this.get('pagination.perPage') * (i - 1))
          });
        }
      }

      if (currentPage > lowerOuterBoundary &&
         currentPage < upperOuterBoundary) {
        // current page
        pageArray.push({
          num: currentPage,
          offset: currentOffset
        });
      }

      // innerwindow > current page
      for (let i = currentPage + 1; i <= upperInnerBoundary; i++) {
        if (i < upperOuterBoundary) {
          pageArray.push({
            num: i,
            offset: (this.get('pagination.perPage') * (i - 1))
          });
        }
      }

      // ... devider unit
      if (upperOuterBoundary - upperInnerBoundary  > 1) {
        pageArray.push({});
      }

      // outerwindow last page
      for (let i = upperOuterBoundary; i < numberOfPages; i++) {
        if (!(i < currentPage)) {
          pageArray.push({
            num: i,
            offset: (this.get('pagination.perPage') * (i - 1))
          });
        }
      }

      pageArray.push({
        num: numberOfPages,
        offset: this.get('pagination.last.offset')
      });
    }
    return pageArray;
  })
});
