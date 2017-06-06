import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'nav',
  classNames: ['pagination-navigation'],

  numberOfPages: Ember.computed('pagination.count', 'pagination.', function () {
    let num = Math.ceil(this.get('pagination.count') / this.get('pagination.limit'));
    let pageArray = [];

    for (let i = 0; i < num; i++) {
      pageArray.push({
        num: i + 1,
        offset: this.get('pagination.limit') * i
      });
    }
    return pageArray;
  })
});
