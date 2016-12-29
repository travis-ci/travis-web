import Ember from 'ember';
import limit from 'travis/utils/computed-limit';

const { test, module } = QUnit;

module('computed-limit');

test('the limit computed property slices an array', function (assert) {
  const LimitContainingObject = Ember.Object.extend({
    limit: 3,
    limitedList: limit('list', 'limit')
  });

  const longListObject = LimitContainingObject.create({ list: [0, 0, 0, 0, 0] });
  assert.equal(longListObject.get('limitedList.length'), 3);

  const shortListObject = LimitContainingObject.create({ list: [0] });
  assert.equal(shortListObject.get('limitedList.length'), 1);

  const changingListObject = LimitContainingObject.create({ list: [0, 0] });
  assert.equal(changingListObject.get('limitedList.length'), 2);

  changingListObject.get('list').addObject(100);
  assert.equal(changingListObject.get('limitedList.length'), 3);

  changingListObject.set('limit', 1);
  assert.equal(changingListObject.get('limitedList.length'), 3, 'expected the limited list not to have changed despite the limit changing');
});
