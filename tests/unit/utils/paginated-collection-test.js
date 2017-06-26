import PaginatedCollection from 'travis/utils/paginated-collection';

const { module, test } = QUnit;

module('paaginatedCollection');

test('takes content and populates the pagination property accordingly', (assert) => {
  let content = {
    meta: {
      pagination: {
        limit: 5,
        offset: 0,
        count: 24,
        is_first: true,
        is_last: false,
        next: {
          offset: 5,
          limit: 5
        },
        prev: null
      }
    }
  };

  let collection = PaginatedCollection.create({ content: content });

  assert.equal(collection.pagination.total, 24, 'returns the total amount of elements');
  assert.equal(collection.pagination.perPage, 5, 'returns the per page limit');
  assert.equal(collection.pagination.isFirst, true, 'knows if it is the first page');
  assert.equal(collection.pagination.isLast, false, 'knows if it is not the last page');
  assert.equal(collection.pagination.next.offset, 5, 'kann access next page info');
});
