import eventually from 'travis/utils/eventually';

const { module, test } = QUnit;

module('eventually');

test("eventually runs a callback with passed item right away if it's not a promise", function (assert) {
  let done = assert.async();
  assert.expect(1);

  eventually({ foo: 'bar' }, function (result) {
    assert.equal(result.foo, 'bar');
    done();
  });
});

test('eventually runs a callback when promise resolves if a passed object is a promise', function (assert) {
  let done = assert.async();
  assert.expect(1);

  let promise = { then: function (callback) { callback({ foo: 'bar' }); } };
  eventually(promise, function (result) {
    assert.equal(result.foo, 'bar');
    done();
  });
});
