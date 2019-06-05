import hasErrorWithStatus from 'travis/utils/api-errors';
import { module, test } from 'qunit';


module('api-error', function () {
  let error = {
    errors: [
      { status: 409 }
    ]
  };

  test('returns true if error exists', function (assert) {
    assert.equal(hasErrorWithStatus(error, 409), true);
  });

  test('returns false if error does not exists', function (assert) {
    assert.equal(hasErrorWithStatus(error, 404), false);
  });
});
