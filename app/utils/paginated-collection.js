import Ember from 'ember';
import computed, { alias } from 'ember-computed-decorators';

export default Ember.ArrayProxy.extend({

  @alias('content') arrangedContent: null,

  @computed('content.meta.pagination')
  pagination(paginationData) {
    return {
      total: paginationData.count,
      perPage: paginationData.limit,
      isFirst: paginationData.is_first,
      isLast: paginationData.is_last,
      prev: paginationData.prev,
      next: paginationData.next
    }
  }
});
