import ArrayProxy from '@ember/array/proxy';
import { computed as emberComputed } from '@ember/object';
import { computed } from 'ember-decorators/object';
import { alias } from 'ember-decorators/object/computed';

export default ArrayProxy.extend({

  @alias('content') arrangedContent: null,

  @computed('content.meta.pagination')
  pagination(paginationData) {
    return {
      total: paginationData.count,
      perPage: paginationData.limit,
      offset: paginationData.offset,
      isFirst: paginationData.is_first,
      isLast: paginationData.is_last,
      prev: paginationData.prev,
      next: paginationData.next,
      first: paginationData.first,
      last: paginationData.last,
      currentPage: emberComputed(() => {
        const { offset, limit } = paginationData;
        return (offset / limit + 1);
      }),
      numberOfPages: emberComputed(() => {
        const { count, limit } = paginationData;
        return Math.ceil(count / limit);
      })
    };
  }
});
