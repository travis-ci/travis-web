import ArrayProxy from '@ember/array/proxy';
import { defineProperty, computed } from '@ember/object';
import { alias } from '@ember/object/computed';

export default ArrayProxy.extend({
  arrangedContent: alias('content'),

  pagination: computed('content.meta.pagination', function () {
    let paginationData = this.get('content.meta.pagination');
    let object = {
      total: paginationData?.count || 0,
      perPage: paginationData?.limit || 1,
      offset: paginationData?.offset || 0,
      isFirst: paginationData?.is_first || false,
      isLast: paginationData?.is_last || false,
      prev: paginationData?.prev || 0,
      next: paginationData?.next || 0,
      first: paginationData?.first,
      last: paginationData?.last,
    };

    defineProperty(object, 'currentPage', computed(() => {
      const { offset = 0, limit = 1 } = paginationData || {};
      return (offset / limit + 1);
    }));

    defineProperty(object, 'numberOfPages', computed(() => {
      const { count = 0, limit = 1 } = paginationData || {};
      return Math.ceil(count / limit);
    }));
    return object;
  }),
});
