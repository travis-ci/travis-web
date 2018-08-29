import abstractMethod from 'travis/utils/abstract-method';
import { module, test } from 'qunit';

module('Unit | Utility | abstractMethod', function (hooks) {
  test('Initializer returns a function', function (assert) {
    let result = abstractMethod();
    assert.ok(typeof result === 'function');
  });

  test('Abstract function throws an error when executed', function (assert) {
    let result = abstractMethod();
    assert.throws(result);
  });

  test('Abstract function contains method name', function (assert) {
    const METHOD_NAME = 'testMethod';
    let result = abstractMethod(METHOD_NAME);

    assert.throws(result, function (err) {
      return err.toString().indexOf(METHOD_NAME) > 0;
    });
  });
});
