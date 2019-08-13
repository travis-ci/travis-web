import { checkDictionary, requireProp } from 'travis/utils/ui-kit/assertions';
import { module, test } from 'qunit';

const DICTIONARY = {
  PRESENT: 'present'
};

module('Unit | Utility | ui-kit/assertions', function () {

  module('checkDictionary', function () {
    test('Finds present value', function (assert) {
      const result = checkDictionary('present', DICTIONARY);
      assert.ok(result);
    });

    test('Doesn\'t find missing value', function (assert) {
      const val = 'not-present';
      const propName = 'Prop';
      const compName = 'Test';
      const expectedMessage = new RegExp(
        `Error: Assertion Failed: ${propName} "${val}" is not allowed on this ${compName} component`
      );
      assert.throws(
        () => { checkDictionary(val, DICTIONARY, propName, compName); },
        expectedMessage
      );
    });

    test('Allows null value', function (assert) {
      const result = checkDictionary(null, DICTIONARY);
      assert.ok(result);
    });
  });

  module('requireProp', function () {
    test('Finds present value', function (assert) {
      const val = 'present';
      const result = requireProp(val);
      assert.ok(result);
    });

    test('Doesn\'t allow null value', function (assert) {
      const val = null;
      const propName = 'Prop';
      const compName = 'Test';
      const expectedMessage = new RegExp(
        `Error: Assertion Failed: ${propName} property must be present on this ${compName} component. Current value: ${val}`
      );
      assert.throws(
        () => { requireProp(val, propName, compName); },
        expectedMessage
      );
    });

    test('Doesn\'t allow undefined value', function (assert) {
      const val = undefined;
      const propName = 'Prop';
      const compName = 'Test';
      const expectedMessage = new RegExp(
        `Error: Assertion Failed: ${propName} property must be present on this ${compName} component. Current value: ${val}`
      );
      assert.throws(
        () => { requireProp(val, propName, compName); },
        expectedMessage
      );
    });
  });
});
