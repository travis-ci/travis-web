import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Integration | Component | heatmap', function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test('it renders heatmap container', async function (assert) {
    await render(hbs`<Heatmap />`);
    assert
      .dom('[data-test-heatmap-container]')
      .exists('Heatmap Container Exists');
  });

  test('it renders heatmap dropdowns builds', async function (assert) {
    await render(hbs`<Heatmap />`);
    assert
      .dom('.heatmap-range-selector')
      .exists('Heatmap Builds and Year Dropdown Exist');
    assert
      .dom('.build-filter-label')
      .exists('Heatmap should contain build label');
    assert.dom('.build-filter-label').hasText('All Builds');
    assert.dom('.build-filter-label').hasClass('build-filter-label');
    assert.dom('[data-test-down-arrow]').hasClass('caret-heatmap');
    assert.dom('[data-test-down-arrow]').hasClass('down-heatmap');

    await click('.build-filter-label');

    assert
      .dom('[data-test-build-filter-all]')
      .exists('Heatmap should contain build label - All Builds');
    assert.dom('[data-test-build-filter-all]').hasText('All Builds');
    assert
      .dom('[data-test-box-all]')
      .exists('All Builds dropdown should contain color box container');
    assert.dom('[data-test-box-all]').hasClass('box-dropdown-heatmap');
    assert.dom('[data-test-box-all]').hasClass('all-dropdown-heatmap');

    assert
      .dom('[data-test-build-filter-success]')
      .exists('Heatmap should contain build label - Successful Builds');
    assert.dom('[data-test-build-filter-success]').hasText('Successful Builds');
    assert
      .dom('[data-test-box-success]')
      .exists('Success Builds dropdown should contain color box container');
    assert.dom('[data-test-box-success]').hasClass('box-dropdown-heatmap');
    assert.dom('[data-test-box-success]').hasClass('successful-dropdown-heatmap');

    assert
      .dom('[data-test-build-filter-failed]')
      .exists('Heatmap should contain build label - Failed Builds');
    assert.dom('[data-test-build-filter-failed]').hasText('Failed Builds');
    assert
      .dom('[data-test-box-failed]')
      .exists('Failed Builds dropdown should contain color box container');
    assert.dom('[data-test-box-failed]').hasClass('box-dropdown-heatmap');
    assert.dom('[data-test-box-failed]').hasClass('failed-dropdown-heatmap');

    assert
      .dom('[data-test-build-filter-error]')
      .exists('Heatmap should contain build label - Errored Builds');
    assert.dom('[data-test-build-filter-error]').hasText('Errored Builds');
    assert
      .dom('[data-test-box-error]')
      .exists('Error Builds dropdown should contain color box container');
    assert.dom('[data-test-box-error]').hasClass('box-dropdown-heatmap');
    assert.dom('[data-test-box-error]').hasClass('errored-dropdown-heatmap');

    assert
      .dom('[data-test-build-filter-cancel]')
      .exists('Heatmap should contain build label - Canceled Builds');
    assert.dom('[data-test-build-filter-cancel]').hasText('Canceled Builds');
    assert
      .dom('[data-test-box-cancel]')
      .exists('Cancel Builds dropdown should contain color box container');
    assert.dom('[data-test-box-cancel]').hasClass('box-dropdown-heatmap');
    assert.dom('[data-test-box-cancel]').hasClass('canceled-dropdown-heatmap');
  });

  test('it renders build year dropdown', async function (assert) {
    await render(hbs`<Heatmap />`);

    assert
      .dom('[data-test-build-year-dropdown-container]')
      .exists('Heatmap should contain build years dropdown container');

    assert.dom('.build-year').exists('Heatmap should contain build year label');
    assert.dom('.build-year').hasText(new Date().getFullYear().toString());
  });

  test('it renders weekday on side of heatmap', async function (assert) {
    await render(hbs`<Heatmap />`);
    assert
      .dom('[data-test-day-label-container]')
      .exists('Heatmap contains weekdays');

    assert
      .dom('[data-test-day-label-mon]')
      .exists('Heatmap should contain day label - Mon');
    assert.dom('[data-test-day-label-mon]').hasClass('day-label');
    assert.dom('[data-test-day-label-mon]').hasText('Mon');

    assert
      .dom('[data-test-day-label-tue]')
      .exists('Heatmap should contain day label - Tue');
    assert.dom('[data-test-day-label-tue]').hasClass('day-label');
    assert.dom('[data-test-day-label-tue]').hasText('Tue');

    assert
      .dom('[data-test-day-label-wed]')
      .exists('Heatmap should contain day label - Wed');
    assert.dom('[data-test-day-label-wed]').hasClass('day-label');
    assert.dom('[data-test-day-label-wed]').hasText('Wed');

    assert
      .dom('[data-test-day-label-thu]')
      .exists('Heatmap should contain day label - Thu');
    assert.dom('[data-test-day-label-thu]').hasClass('day-label');
    assert.dom('[data-test-day-label-thu').hasText('Thu');

    assert
      .dom('[data-test-day-label-fri]')
      .exists('Heatmap should contain day label - Fri');
    assert.dom('[data-test-day-label-fri]').hasClass('day-label');
    assert.dom('[data-test-day-label-fri]').hasText('Fri');

    assert
      .dom('[data-test-day-label-sat]')
      .exists('Heatmap should contain day label - Sat');
    assert.dom('[data-test-day-label-sat]').hasClass('day-label');
    assert.dom('[data-test-day-label-sat]').hasText('Sat');

    assert
      .dom('[data-test-day-label-sun]')
      .exists('Heatmap should contain day label - sun');
    assert.dom('[data-test-day-label-sun]').hasClass('day-label');
    assert.dom('[data-test-day-label-sun]').hasText('Sun');
  });

  test('it render heatmap node selector', async function (assert) {
    await render(hbs`<Heatmap />`);
    assert
      .dom('#insights-heatmap')
      .exists('Should exits heatmap node container for rendering heatmap');
  });

  test('it render selected successful build from the dropdown', async function (assert) {
    await render(hbs`<Heatmap />`);
    await click('[data-test-down-arrow]');
    await click('[data-test-box-success]');
    assert.dom('.build-filter-label').hasText('Successful Builds');
  });

  test('it render selected failed build from the dropdown', async function (assert) {
    await render(hbs`<Heatmap />`);
    await click('[data-test-down-arrow]');
    await click('[data-test-box-failed]');
    assert.dom('.build-filter-label').hasText('Failed Builds');
  });

  test('it render selected errored build from the dropdown', async function (assert) {
    await render(hbs`<Heatmap />`);
    await click('[data-test-down-arrow]');
    await click('[data-test-box-error]');
    assert.dom('.build-filter-label').hasText('Errored Builds');
  });

  test('it render selected canceled build from the dropdown', async function (assert) {
    await render(hbs`<Heatmap />`);
    await click('[data-test-down-arrow]');
    await click('[data-test-box-cancel]');
    assert.dom('.build-filter-label').hasText('Canceled Builds');
  });

  test('it render selected all builds from the dropdown after selecting other builds', async function (assert) {
    await render(hbs`<Heatmap />`);
    await click('[data-test-down-arrow]');
    await click('[data-test-box-cancel]');
    assert.dom('.build-filter-label').hasText('Canceled Builds');

    await click('[data-test-down-arrow]');
    await click('[data-test-box-all]');
    assert.dom('.build-filter-label').hasText('All Builds');
  });
});
