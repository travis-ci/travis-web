import ArrayProxy from '@ember/array/proxy';
import { defineProperty, computed } from '@ember/object';
import { alias } from '@ember/object/computed';

export default ArrayProxy.extend({
  arrangedContent: alias('content'),

  pagination: computed('content.meta.pagination', function () {
    let paginationData = this.get('content.meta.pagination');
    let object = {
      total: paginationData.count,
      perPage: paginationData.limit,
      offset: paginationData.offset,
      isFirst: paginationData.is_first,
      isLast: paginationData.is_last,
      prev: paginationData.prev,
      next: paginationData.next,
      first: paginationData.first,
      last: paginationData.last,
    };

    defineProperty(object, 'currentPage', computed(() => {
      const { offset, limit } = paginationData;
      return (offset / limit + 1);
    }));

    defineProperty(object, 'numberOfPages', computed(() => {
      const { count, limit } = paginationData;
      return Math.ceil(count / limit);
    }));

    return object;
  }),
});
