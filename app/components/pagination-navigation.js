import Ember from 'ember';
import { alias } from 'ember-computed-decorators';

export default Ember.Component.extend({
  tagName: 'nav',
  classNames: ['pagination-navigation'],
  @alias('collection.pagination') pagination: null,

  numberOfPages: Ember.computed('pagination.total', 'pagination.', function () {
    let num = Math.ceil(this.get('pagination.total') / this.get('pagination.perPage'));
    let pageArray = [];

    for (let i = 0; i < num; i++) {
      pageArray.push({
        num: i + 1,
        offset: this.get('pagination.perPage') * i
      });
    }
    return pageArray;
  })
});
