import Ember from 'ember';
import { computed } from 'ember-decorators/object';
import { alias } from 'ember-decorators/object/computed';

export default Ember.ArrayProxy.extend({

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
      currentPage: Ember.computed(() => {
        const { offset, limit } = paginationData;
        return (offset / limit + 1);
      }),
      numberOfPages: Ember.computed(() => {
        const { count, limit } = paginationData;
        return Math.ceil(count / limit);
      })
    };
  }
});
