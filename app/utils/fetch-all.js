export default async function fetchAll(store, type, query = {}) {
  let allRecords = [];
  let currentQuery = Object.assign({}, query);
  let hasNextPage = true;

  while (hasNextPage) {
    const collection = await store.query(type, currentQuery);
    allRecords = allRecords.concat(collection.toArray());

    const nextPage = collection.get('meta.pagination.next');
    if (nextPage) {
      currentQuery = { ...currentQuery, ...nextPage };
    } else {
      hasNextPage = false;
    }
  }

  return allRecords;
}
