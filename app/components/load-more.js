import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { A } from '@ember/array';
import { computed } from '@ember/object';
import { and, empty, not } from '@ember/object/computed';

const DEFAULT_LIMIT = 10;

export default Component.extend({
  tagName: '',

  store: service(),

  modelName: 'build',
  options: computed(() => ({})),
  limit: DEFAULT_LIMIT,
  startFirstLoad: false,
  initialItems: null,

  fetchTask: task(function* () {
    const { items, limit } = this;
    const { length: offset = 0 } = items;

    const result = yield this.queryStore(limit, offset);

    this.loadItems(result, limit);

    return result;
  }).drop(),

  queryStore(limit = DEFAULT_LIMIT, offset = 0) {
    const { modelName, options } = this;
    const queryOptions = { ...options, limit, offset };

    return this.store.query(modelName, queryOptions);
  },

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
