import Component from '@ember/component';
import { and, empty, or } from '@ember/object/computed';

export default Component.extend({
  tagName: '',

  dynamicQuery: null,
  liveItems: null,

  items: or('liveItems', 'dynamicQuery'),
  isItemsEmpty: empty('items'),
  isNoneFound: and('dynamicQuery.isNotLoading', 'isItemsEmpty'),

  actions: {
    showMore() {
      return this.dynamicQuery.switchToNextPage();
    }
  },
});
