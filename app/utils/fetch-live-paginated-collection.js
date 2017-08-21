import LivePaginatedCollection from 'travis/utils/live-paginated-collection';

// Fetches a LivePaginatedCollection instance
//
// It will use store.filter function in order to get a base for pagination and
// then it will create a paginated collection with a content set to the filtered
// collection.
let fetchLivePaginatedCollection = function (store, modelName, queryParams, options) {
  let dependencies = options.dependencies || [],
    filter = filter || (() => true),
    filtered = store.filter(modelName, queryParams, filter, dependencies, options.forceReload);

  return filtered.then((filteredArray) => {
    let sort = options.sort;
    let liveCollection =
      LivePaginatedCollection.create({ modelName, store, sort, dependencies, content: filteredArray });

    if (options.forceReload) {
      // if forceReload was used, another query was fetched and we can update
      // pagination data based on the result
      filteredArray._lastPromise.then((array) =>
        liveCollection.setPaginationData(array.get('queryResult'))
      );
      liveCollection._lastPromise = filteredArray._lastPromise;
    }

    return liveCollection;
  });
};

export default fetchLivePaginatedCollection;
