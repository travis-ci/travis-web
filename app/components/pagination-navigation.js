import Component from '@ember/component';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';

export default Component.extend({
  tagName: 'nav',
  classNames: ['pagination-navigation'],

  queryParam: 'page',
  pagination: alias('collection.pagination'),

  prevPageNumber: computed('pagination.{currentPage,isFirst}', function () {
    let page = this.get('pagination.currentPage');
    let isFirst = this.get('pagination.isFirst');

    if (!isFirst) {
      return page - 1;
    }
    return undefined;
  }),

  nextPageNumber: computed('pagination.{currentPage,isLast}', function () {
    let page = this.get('pagination.currentPage');
    let isLast = this.get('pagination.isLast');

    if (!isLast) {
      return page + 1;
    }
    return undefined;
  }),

  outerWindow: computed('outer', function () {
    return this.get('outer') || 1;
  }),

  innerWindow: computed('inner', function () {
    return this.get('inner') || 2;
  }),

  pages: computed(
    'pagination.{numberOfPages,perPage,currentPage,offset}',
    'innerWindow',
    'outerWindow',
    function () {
      let numberOfPages = this.get('pagination.numberOfPages');
      let perPage = this.get('pagination.perPage');
      let currentPage = this.get('pagination.currentPage');
      let offset = this.get('pagination.offset');
      let innerWindow = this.get('innerWindow');
      let outerWindow = this.get('outerWindow');

      let thresholdDisplayAll = ((outerWindow + 1) * 2) + (innerWindow + 1);
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
        if (currentPage !== 1) {
          for (let i = 1; i <= outerWindow; i++) {
            if (i !== currentPage) {
              pageArray.push({
                num: i + 1,
                offset: perPage * i
              });
            }
          }
        }

        // ... divider unit
        if (lowerInnerBoundary - pageArray.length > outerWindow) {
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
