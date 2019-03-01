import Component from '@ember/component';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';

export default Component.extend({
  tagName: 'nav',
  classNames: ['pagination-navigation'],

  queryParam: 'page',
  outer: 1,
  inner: 2,

  pagination: reads('collection.pagination'),

  prevPageNumber: computed('pagination.{currentPage,isFirst}', function () {
    const { currentPage, isFirst } = this.pagination;
    if (!isFirst) {
      return currentPage - 1;
    }
  }),

  nextPageNumber: computed('pagination.{currentPage,isLast}', function () {
    const { currentPage, isLast } = this.pagination;
    if (!isLast) {
      return currentPage + 1;
    }
  }),

  pages: computed(
    'pagination.{numberOfPages,perPage,currentPage,offset}',
    'inner',
    'outer',
    function () {
      const { outer, inner, pagination } = this;
      const { numberOfPages, perPage, currentPage, offset } = pagination;

      const thresholdDisplayAll = (outer + 1) * 2 + (inner + 1);
      let pageArray = [];

      // display all pages if there is only a few
      if (numberOfPages <= thresholdDisplayAll) {
        for (let i = 0; i < numberOfPages; i++) {
          pageArray.push({
            num: i + 1,
            offset: perPage * i
          });
        }
        // else stack together pagination
      } else {
        let innerHalf = Math.ceil(inner / 2);
        let lowerInnerBoundary = currentPage - innerHalf;
        if (lowerInnerBoundary < 0) {
          lowerInnerBoundary = 0;
        }
        let upperInnerBoundary = currentPage + innerHalf;
        let lowerOuterBoundary = 1 + outer;
        let upperOuterBoundary = numberOfPages - outer;

        pageArray.push({
          num: 1,
          offset: 0
        });

        // outerwindow first page
        if (currentPage !== 1) {
          for (let i = 1; i <= outer; i++) {
            if (i !== currentPage) {
              pageArray.push({
                num: i + 1,
                offset: perPage * i
              });
            }
          }
        }

        // ... divider unit
        if (lowerInnerBoundary - pageArray.length > outer) {
          pageArray.push({});
        }

        // innerwindow < current page
        for (let i = lowerInnerBoundary; i < currentPage; i++) {
          if (i > lowerOuterBoundary) {
            pageArray.push({
              num: i,
              offset: perPage * (i - 1)
            });
          }
        }

        if (currentPage > lowerOuterBoundary &&
          currentPage < upperOuterBoundary) {
          // current page
          pageArray.push({
            num: currentPage,
            offset,
          });
        }

        // innerwindow > current page
        for (let i = currentPage + 1; i <= upperInnerBoundary; i++) {
          if (i < upperOuterBoundary) {
            pageArray.push({
              num: i,
              offset: perPage * (i - 1)
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
              offset: perPage * (i - 1)
            });
          }
        }

        pageArray.push({
          num: numberOfPages,
          offset: this.get('pagination.last.offset')
        });
      }
      return pageArray;
    }
  ),

  showPagination: computed('pages', function () {
    return this.get('pages').length > 1;
  })

});
