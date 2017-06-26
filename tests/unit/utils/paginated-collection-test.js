import PaginatedCollection from 'travis/utils/paginated-collection';
import { module, test } from 'qunit';

module('Unit | Utility | paginated collection');

test('takes content and populates the pagination property accordingly', function (assert) {
  const array = [],
    meta = {
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
    };

  array.set('meta', meta);

  let collection = PaginatedCollection.create({ content: array });

  assert.equal(collection.get('pagination.total'), 24, 'returns the total amount of elements');
  assert.equal(collection.get('pagination.perPage'), 5, 'returns the per page limit');
  assert.equal(collection.get('pagination.isFirst'), true, 'knows if it is the first page');
  assert.equal(collection.get('pagination.isLast'), false, 'knows if it is not the last page');
  assert.equal(collection.get('pagination.next.offset'), 5, 'can access next page info');

  assert.equal(collection.get('pagination.currentPage'), 1, 'calculates correct current page');
  assert.equal(collection.get('pagination.numberOfPages'), 5, 'calculates correct total number of pages');

});
