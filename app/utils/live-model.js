import EmberObject from '@ember/object';
import dynamicQuery from 'travis/utils/dynamic-query';
import { filter, sort } from '@ember/object/computed';
import config from 'travis/config/environment';
import { isEmpty } from '@ember/utils';

const { dashboardReposPerPage: limit } = config.pagination;

export default function getLiveModel({
  modelName,
  query,
  fetchFn,
  dynamicQueryOptions,
  filterFn,
  filterKeys,
  sortProps,
  sortFn,
  store,
} = {}) {
  const fetch = fetchFn || function ({ page }) {
    const offset = (page - 1) * limit;
    const qopts = {
      ...query,
      limit,
      offset,
    };
    return store.query(modelName, qopts);
  };
  const currentFilterFn = filterFn || ((item) => true);
  const currentFilterKeys = filterKeys || [];
  const items = store.peekAll(modelName);
  const sorter = sortProps || sortFn || (() => true);

  const filterDep = isEmpty(currentFilterKeys) ?
    'items.[]' :
    `items.@each.{${currentFilterKeys.join(',')}}`;

  const eor = EmberObject.extend({
    loader: dynamicQuery(function* ({ page = 1 }) {
      return yield this.fetch({ page });
    }, dynamicQueryOptions),

    filtered: filter(filterDep, currentFilterKeys, currentFilterFn),
    sorted: typeof sorter === 'function' ?
      sort('filtered', sorter) :
      sort('filtered', 'sorter'),
  }).create({
    modelName,
    query,
    fetch,
    dynamicQueryOptions,
    filterer: currentFilterFn,
    sortProps,
    sortFn,
    sorter,

    store,

    items,
  });

  eor.loader.init();

  return eor;
}
