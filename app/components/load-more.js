import Component from '@ember/component';
import { and } from '@ember/object/computed';
import { assert } from '@ember/debug';

export default Component.extend({
  tagName: '',

  items: null, // Should be a DynamicQuery
  missingNotice: '',

  isNoneFound: and('items.isNotLoading', 'items.isEmpty'),

  didReceiveAttrs() {
    this._super(...arguments);
    assert('LoadMore component requires a DynamicQuery with appendResults=true', this.items.appendResults);
  },

  actions: {
    showMore() {
      return this.items.switchToNextPage();
    }
  },
});
