import EmberObject from '@ember/object';
import dynamicQuery from 'travis/utils/dynamic-query';
import { filter, sort } from '@ember/object/computed';
import config from 'travis/config/environment';

const { dashboardReposPerPage: limit } = config.pagination;

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
    const offset = (page - 1) * limit;
    const qopts = {
      ...query,
      limit,
      offset,
    };
    console.log('FETCHING', modelName, qopts);
    return store.query(modelName, qopts);
  };
  const currentFilterFn = filterFn || ((item) => true);
  const items = store.peekAll(modelName);

  const eor = EmberObject.extend({
    loader: dynamicQuery(function* ({ page = 1 }) {
      console.log('dairy queen', page);
      return yield this.fetch({ page });
    }, dynamicQueryOptions),

    filtered: filter('items', currentFilterFn),
    sorted: sort('filtered', 'sorter'),

  }).create({
    modelName,
    query,
    fetch,
    dynamicQueryOptions,
    filterer: currentFilterFn,
    sorter: sortProps,

    store,

    items,
  });

  return eor;
}
