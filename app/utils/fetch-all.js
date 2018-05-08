import { merge } from '@ember/polyfills';

let fetchAll = function (store, type, query) {
  return store.query(type, query).then((collection) => {
    let nextPage = collection.get('meta.pagination.next');
    if (nextPage) {
      let { limit, offset } = nextPage;
      return fetchAll(store, type, merge(query, { limit, offset }));
    }
  });
};

export default fetchAll;
