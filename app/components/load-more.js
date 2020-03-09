import Component from '@ember/component';
import { computed } from '@ember/object';
import { and, empty } from '@ember/object/computed';

export default Component.extend({
  tagName: '',

  dynamicQuery: null,
  liveItems: null,

  items: computed('liveItems', 'dynamicQuery', function () {
    const { liveItems, dynamicQuery } = this;

    if (liveItems)
      return liveItems;
    else
      return dynamicQuery;
  }),
  isItemsEmpty: empty('items'),
  isNoneFound: and('dynamicQuery.isNotLoading', 'isItemsEmpty'),

  actions: {
    showMore() {
      return this.dynamicQuery.switchToNextPage();
    }
  },
});
