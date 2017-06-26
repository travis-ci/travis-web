import Ember from 'ember';
import computed, { alias } from 'ember-computed-decorators';

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
      currentPage: Ember.computed(function () {
        return (paginationData.offset / paginationData.limit + 1);
      }),
      numberOfPages: Ember.computed(function () {
        return Math.ceil(paginationData.count / paginationData.limit);
      })
    };
  }
});
