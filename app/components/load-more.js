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
  startFirstLoad: true,

  fetchTask: task(function* () {
    const { modelName, items, limit, options } = this;
    const { length: offset = 0 } = items;
    const queryOptions = { ...options, limit, offset };

    const result = yield this.store.query(modelName, queryOptions);

    result.forEach(item => items.pushObject(item));

    if (result.length < limit) {
      this.set('isLastItemFound', true);
    }

    return result;
  }).drop(),

  items: computed(() => A()),
  isEmptyItems: empty('items'),
  isLastItemFound: false,
  isNotLastItemFound: not('isLastItemFound'),

  isNoneFound: and('isLastItemFound', 'isEmptyItems'),

  didReceiveAttrs() {
    this._super(...arguments);
    if (this.startFirstLoad) {
      this.fetchTask.perform();
    }
  },
});
