import eventually from 'travis/utils/eventually';

module('eventually');

test("eventually runs a callback with passed item right away if it's not a promise", () => {
  stop();
  expect(1);

  eventually({ foo: 'bar' }, result => {
    equal(result.foo, 'bar');
    start();
  });
});

test('eventually runs a callback when promise resolves if a passed object is a promise', () => {
  stop();
  expect(1);

  let promise = { then(callback) { callback({ foo: 'bar' }); } };
  eventually(promise, result => {
    equal(result.foo, 'bar');
    start();
  });
});
