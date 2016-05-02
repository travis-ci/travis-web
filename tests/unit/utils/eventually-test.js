import Ember from 'ember';
import eventually from 'travis/utils/eventually';

module("eventually");

test("eventually runs a callback with passed item right away if it's not a promise", function() {
  stop();
  expect(1);

  eventually({ foo: 'bar' }, function(result) {
    equal(result.foo, 'bar');
    start();
  });
});

test("eventually runs a callback when promise resolves if a passed object is a promise", function() {
  stop();
  expect(1);

  let promise = { then: function(callback) { callback({ foo: 'bar'}); } };
  eventually(promise, function(result) {
    equal(result.foo, 'bar');
    start();
  });
});
