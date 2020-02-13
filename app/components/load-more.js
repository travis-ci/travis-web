import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { A } from '@ember/array';
import { computed } from '@ember/object';
import { and, empty, not } from '@ember/object/computed';

export default Component.extend({
  tagName: '',

  store: service(),

  modelName: 'build',
  options: computed(() => ({})),
  limit: 10,
  startFirstLoad: false,
  initialItems: null,

  fetchTask: task(function* () {
    const { modelName, items, limit, options } = this;
    const { length: offset = 0 } = items;
    const queryOptions = { ...options, limit, offset };

    const result = yield this.store.query(modelName, queryOptions);

    this.loadItems(result, limit);

    return result;
  }).drop(),

  loadItems(newItems, lastFoundThreshold = 1) {
    newItems.forEach(item => this.items.pushObject(item));

    if (newItems.length < lastFoundThreshold) {
      this.set('isLastItemFound', true);
    }
  },

  items: computed(() => A()),
  isEmptyItems: empty('items'),
  isLastItemFound: false,
  isNotLastItemFound: not('isLastItemFound'),

  isNoneFound: and('isLastItemFound', 'isEmptyItems'),

  didReceiveAttrs() {
    this._super(...arguments);
    if (this.initialItems) {
      this.loadItems(this.initialItems);
    }
    if (this.startFirstLoad) {
      this.fetchTask.perform();
    }
  },
});
