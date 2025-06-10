let fetchAll = function (store, type, query) {
  return store.query(type, query).then((collection) => {
    let nextPage = collection.get('meta.pagination.next');
    if (nextPage) {
      let { limit, offset } = nextPage;
      return fetchAll(store, type, Object.assign(query, { limit, offset }));
    }
  });
};

export default fetchAll;
