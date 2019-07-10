import { generateYearsFromCurrent, generateMonthNumber } from 'travis/utils/generated-dates';

import { module, test } from 'qunit';

module('genratedDates', function (hooks) {

  const numberOfYears = 11;

  test('returns correct number of years', function (assert) {
    assert.expect(1);

    const years = generateYearsFromCurrent(numberOfYears);

    assert.equal(years.length, numberOfYears);
  });

  test('returns current year as the first', function (assert) {
    assert.expect(1);

    const years = generateYearsFromCurrent(numberOfYears);

    assert.equal(years[0], new Date().getFullYear());
  });

  test('returns correct last year', function (assert) {
    assert.expect(1);

    const years = generateYearsFromCurrent(numberOfYears);
    const lastYear = new Date().getFullYear() + numberOfYears - 1;

    assert.equal(years[years.length - 1], lastYear);
  });

  test('returns 12 months correcly', function (assert) {
    assert.expect(1);

    const months = generateMonthNumber();

    assert.equal(months.length, 12);
  });

  test('returns correct first month', function (assert) {
    assert.expect(1);

    const months = generateMonthNumber();

    assert.equal(months[0], '01');
  });

  test('returns correct last month', function (assert) {
    assert.expect(1);

    const months = generateMonthNumber();

    assert.equal(months[months.length - 1], '12');
  });
});
