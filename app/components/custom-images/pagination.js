import Component from '@ember/component';
import { computed } from '@ember/object';
import { isEmpty } from '@ember/utils';
import { inject as service } from '@ember/service';

export default Component.extend({
  tagName: 'nav',
  classNames: ['pagination-navigation'],

  router: service(),

  showPagination: true,

  numberOfPages: computed('totalCount', 'perPage', function () {
    const { totalCount, perPage } = this;
    if (totalCount === 0 || perPage === 0) {
      return 0;
    }
    return Math.ceil(totalCount / perPage);
  }),

  nextPage: computed('currentPage', 'numberOfPages', function () {
    const { currentPage, numberOfPages } = this;
    return currentPage < numberOfPages ? this.buildPage(currentPage + 1) : null;
  }),

  prevPage: computed('currentPage', 'numberOfPages', function () {
    const { currentPage } = this;
    return currentPage > 1 ? this.buildPage(currentPage - 1) : null;
  }),

  pages: computed('numberOfPages', 'perPage', 'currentPage', 'offset', 'inner', 'outer', function () {
    const { outer, inner, numberOfPages, currentPage, offset } = this;

    const thresholdDisplayAll = (outer + 1) * 2 + (inner + 1);
    const pageArray = [];

    if (numberOfPages <= thresholdDisplayAll) {
      for (let i = 0; i < numberOfPages; i++) {
        pageArray.push(this.buildPage(i + 1));
      }
    } else {
      let innerHalf = Math.ceil(inner / 2);
      let lowerInnerBoundary = currentPage - innerHalf;
      if (lowerInnerBoundary < 0) {
        lowerInnerBoundary = 0;
      }
      let upperInnerBoundary = currentPage + innerHalf;
      let lowerOuterBoundary = 1 + outer;
      let upperOuterBoundary = numberOfPages - outer;

      pageArray.push(this.buildPage(1));

      if (currentPage !== 1) {
        for (let i = 1; i <= outer; i++) {
          if (i !== currentPage) {
            pageArray.push(this.buildPage(i + 1));
          }
        }
      }

      if (lowerInnerBoundary - pageArray.length > outer) {
        pageArray.push({});
      }

      for (let i = lowerInnerBoundary; i < currentPage; i++) {
        if (i > lowerOuterBoundary) {
          pageArray.push(this.buildPage(i));
        }
      }

      if (currentPage > lowerOuterBoundary &&
        currentPage < upperOuterBoundary) {
        pageArray.push(this.buildPage(currentPage, offset));
      }

      for (let i = currentPage + 1; i <= upperInnerBoundary; i++) {
        if (i < upperOuterBoundary) {
          pageArray.push(this.buildPage(i));
        }
      }

      if (upperOuterBoundary - upperInnerBoundary  > 1) {
        pageArray.push({});
      }

      for (let i = upperOuterBoundary; i <= numberOfPages; i++) {
        if (i >= currentPage) {
          pageArray.push(this.buildPage(i));
        }
      }
    }

    return pageArray;
  }),

  buildPage(num, offset) {
    const { perPage = 0 } = this;
    const isCurrent = num === this.currentPage;

    if (isEmpty(offset)) {
      offset = perPage * (num - 1);
    }

    return { num, offset, isCurrent };
  },

  actions: {
    switchToPage(page) {
      this.onPageChange(page.num);
    }
  }
});
