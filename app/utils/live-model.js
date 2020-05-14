import EmberObject from '@ember/object';
import dynamicQuery from 'travis/utils/dynamic-query';
import { filter, sort } from '@ember/object/computed';

export default function getLiveModel({
  modelName,
  query,
  fetch: fetchFn,
  dynamicQueryOptions,
  filter: filterFn,
  sort: sortProps,
  store,
} = {}) {
  const fetch = fetchFn || function ({ page }) {
    return store.query(modelName, query);
  };
  const currentFilterFn = filterFn || ((item) => true);
  const items = store.peekAll(modelName);

  const eor = EmberObject.create({
    modelName,
    query,
    fetch,
    dynamicQueryOptions,
    filterer: currentFilterFn,
    sorter: sortProps,

    store,

    items,

    // loader: dynamicQuery(function* ({ page = 1 }) {
    //   return yield this.fetch({ page });
    // }, dynamicQueryOptions),

    // filtered: filter('items', currentFilterFn),
    // sorted: sort('filtered', 'sorter'),

  });

  return eor;
}
