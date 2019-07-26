import Component from '@ember/component';
import { computed } from '@ember/object';
import { gt, reads } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';

export default Component.extend({
  tagName: 'nav',
  classNames: ['pagination-navigation'],

  router: service(),

  queryParam: 'page',
  outer: 1,
  inner: 2,

  route: reads('router.currentRouteName'),

  pagination: reads('collection.pagination'),

  currentPage: reads('pagination.currentPage'),
  isFirst: reads('pagination.isFirst'),
  isLast: reads('pagination.isLast'),
  offset: reads('pagination.offset'),
  numberOfPages: reads('pagination.numberOfPages'),
  perPage: reads('pagination.perPage'),
  currentRouteName: reads('router.currentRouteName'),

  prevPage: computed('currentPage', 'isFirst', 'currentRouteName', function () {
    return this.isFirst ? null : this.buildPage(this.currentPage - 1);
  }),

  nextPage: computed('currentPage', 'isLast', 'currentRouteName', function () {
    return this.isLast ? null : this.buildPage(this.currentPage + 1);
  }),

  pages: computed('numberOfPages', 'perPage', 'currentPage', 'offset', 'inner', 'outer', 'currentRouteName', function () {
    const { outer, inner, numberOfPages, currentPage, offset } = this;

    const thresholdDisplayAll = (outer + 1) * 2 + (inner + 1);
    let pageArray = [];

    // display all pages if there is only a few
    if (numberOfPages <= thresholdDisplayAll) {
      for (let i = 0; i < numberOfPages; i++) {
        pageArray.push(this.buildPage(i + 1));
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

      pageArray.push(this.buildPage(1));

      // outerwindow first page
      if (currentPage !== 1) {
        for (let i = 1; i <= outer; i++) {
          if (i !== currentPage) {
            pageArray.push(this.buildPage(i + 1));
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
          pageArray.push(this.buildPage(i));
        }
      }

      if (currentPage > lowerOuterBoundary &&
        currentPage < upperOuterBoundary) {
        // current page
        pageArray.push(this.buildPage(currentPage, offset));
      }

      // innerwindow > current page
      for (let i = currentPage + 1; i <= upperInnerBoundary; i++) {
        if (i < upperOuterBoundary) {
          pageArray.push(this.buildPage(i));
        }
      }

      // ... devider unit
      if (upperOuterBoundary - upperInnerBoundary  > 1) {
        pageArray.push({});
      }

      // outerwindow last page
      for (let i = upperOuterBoundary; i < numberOfPages; i++) {
        if (!(i < currentPage)) {
          pageArray.push(this.buildPage(i));
        }
      }

      pageArray.push(this.buildPage(numberOfPages, this.get('pagination.last.offset')));
    }

    return pageArray;
  }),

  showPagination: gt('pages.length', 1),

  buildPage(num, offset) {
    const { route, queryParam, perPage = 0 } = this;
    const queryParams = { [queryParam]: num };
    const isCurrent = num === this.currentPage;

    if (isEmpty(offset)) {
      offset = perPage * (num - 1);
    }

    const url = this.router.urlFor(route, { queryParams });

    return { num, offset, url, isCurrent, queryParams };
  },

  actions: {

    switchToPage({ queryParams }) {
      const { router, route } = this;
      router.transitionTo(route, { queryParams });
      return false; // prevent default <a> click handler
    }

  }

});
