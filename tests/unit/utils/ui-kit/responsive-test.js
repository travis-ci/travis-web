import { getResponsiveProp } from 'travis/utils/ui-kit/responsive';
import { module, test } from 'qunit';

module('Unit | Utility | ui-kit/responsive', function () {

  test('Handles null', function (assert) {
    const result = getResponsiveProp(null);
    assert.deepEqual(result, {
      base: null,
      sm: undefined,
      md: undefined,
      lg: undefined,
      xl: undefined,
    });
  });

  test('Handles undefined', function (assert) {
    let result = getResponsiveProp(undefined);
    assert.deepEqual(result, {
      base: undefined,
      sm: undefined,
      md: undefined,
      lg: undefined,
      xl: undefined,
    });

    result = getResponsiveProp();
    assert.deepEqual(result, {
      base: undefined,
      sm: undefined,
      md: undefined,
      lg: undefined,
      xl: undefined,
    });
  });

  test('Handles plain value', function (assert) {
    const result = getResponsiveProp('test');
    assert.deepEqual(result, {
      base: 'test',
      sm: undefined,
      md: undefined,
      lg: undefined,
      xl: undefined,
    });
  });

  test('Handles object', function (assert) {
    const result = getResponsiveProp({ top: 10 });
    assert.deepEqual(result, {
      base: { top: 10 },
      sm: undefined,
      md: undefined,
      lg: undefined,
      xl: undefined,
    });
  });

  test('Handles base screen', function (assert) {
    const result = getResponsiveProp({ base: 'test' });
    assert.deepEqual(result, {
      base: 'test',
      sm: undefined,
      md: undefined,
      lg: undefined,
      xl: undefined,
    });
  });

  test('Handles other screens', function (assert) {
    const result = getResponsiveProp({
      sm: 'sm-value',
      md: 'md-value',
      lg: 'lg-value',
      xl: { top: 10 },
    });

    assert.deepEqual(result, {
      base: undefined,
      sm: 'sm-value',
      md: 'md-value',
      lg: 'lg-value',
      xl: { top: 10 },
    });
  });

  test('Handles expanded value', function (assert) {
    const result = getResponsiveProp(getResponsiveProp(null));
    assert.deepEqual(result, {
      base: null,
      sm: undefined,
      md: undefined,
      lg: undefined,
      xl: undefined,
    });
  });
});
