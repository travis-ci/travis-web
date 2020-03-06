import Component from '@ember/component';
import { computed } from '@ember/object';
import { and, empty } from '@ember/object/computed';
import { A } from '@ember/array';

export default Component.extend({
  tagName: '',

  dynamicQuery: null,
  liveItems: null,
  missingNotice: '',

  items: computed('liveItems.[]', 'dynamicQuery.[]', function () {
    const { liveItems, dynamicQuery } = this;
    const items = A();

    if (liveItems)
      liveItems.forEach(i => items.pushObject(i));
    else
      dynamicQuery.forEach(i => items.pushObject(i));

    return items;
  }),
  isItemsEmpty: empty('items'),
  isNoneFound: and('dynamicQuery.isNotLoading', 'isItemsEmpty'),

  actions: {
    showMore() {
      return this.dynamicQuery.switchToNextPage();
    }
  },
});
