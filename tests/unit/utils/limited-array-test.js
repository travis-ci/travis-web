import LimitedArray from 'travis/utils/limited-array';

const { module, test } = QUnit;

module('LimitedArray');

test('LimitedArray limits the array it contains', (assert) => {
  const limitedArray = LimitedArray.create({
    limit: 3,
    content: [0, 0, 0, 0, 0]
  });

  assert.equal(limitedArray.get('arrangedContent.length'), 3);
  assert.equal(limitedArray.get('totalLength'), 5);
  assert.equal(limitedArray.get('leftLength'), 2);
  assert.ok(limitedArray.get('isMore'), 'expected limited array to have more content');

  limitedArray.showAll();

  assert.equal(limitedArray.get('arrangedContent.length'), 3, 'expected limited array content length not to have changed despite showing all');
  assert.equal(limitedArray.get('leftLength'), 0);
  assert.notOk(limitedArray.get('isMore'), 'expected limited array to not have more content after showing all');
});
