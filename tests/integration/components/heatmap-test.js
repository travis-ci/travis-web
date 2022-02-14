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

  test('it renders heatmap dropdowns builds and years', async function (assert) {
    await render(hbs`<Heatmap />`);
    assert
      .dom('[data-test-range-selector-heatmap]')
      .exists('Heatmap Builds and Year Dropdown Exist');
    assert
      .dom('.build-filter-label')
      .exists('Heatmap should contain build label');
    assert.dom('.build-filter-label').hasText('All Builds');

    await click('.build-filter-label');

    assert
      .dom('[data-test-build-filter-all]')
      .exists('Heatmap should contain build label - All Builds');
    assert.dom('[data-test-build-filter-all]').hasText('All Builds');

    assert
      .dom('[data-test-build-filter-success]')
      .exists('Heatmap should contain build label - Successful Builds');
    assert.dom('[data-test-build-filter-success]').hasText('Successful Builds');

    assert
      .dom('[data-test-build-filter-failed]')
      .exists('Heatmap should contain build label - Failed Builds');
    assert.dom('[data-test-build-filter-failed]').hasText('Failed Builds');

    assert
      .dom('[data-test-build-filter-error]')
      .exists('Heatmap should contain build label - Errored Builds');
    assert.dom('[data-test-build-filter-error]').hasText('Errored Builds');

    assert
      .dom('[data-test-build-filter-cancel]')
      .exists('Heatmap should contain build label - Canceled Builds');
    assert.dom('[data-test-build-filter-cancel]').hasText('Canceled Builds');
  });

  test('it renders weekday on side of heatmap', async function (assert) {
    await render(hbs`<Heatmap />`);
    assert
      .dom('[data-test-day-label-container]')
      .exists('Heatmap contains weekdays');

    assert
      .dom('[data-test-day-label-mon]')
      .exists('Heatmap should contain day label - Mon');
    assert.dom('[data-test-day-label-mon]').hasText('Mon');

    assert
      .dom('[data-test-day-label-tue]')
      .exists('Heatmap should contain day label - Tue');
    assert.dom('[data-test-day-label-tue]').hasText('Tue');

    assert
      .dom('[data-test-day-label-wed]')
      .exists('Heatmap should contain day label - Wed');
    assert.dom('[data-test-day-label-wed]').hasText('Wed');

    assert
      .dom('[data-test-day-label-thu]')
      .exists('Heatmap should contain day label - Thu');
    assert.dom('[data-test-day-label-thu').hasText('Thu');

    assert
      .dom('[data-test-day-label-fri]')
      .exists('Heatmap should contain day label - Fri');
    assert.dom('[data-test-day-label-fri]').hasText('Fri');

    assert
      .dom('[data-test-day-label-sat]')
      .exists('Heatmap should contain day label - Sat');
    assert.dom('[data-test-day-label-sat]').hasText('Sat');

    assert
      .dom('[data-test-day-label-sun]')
      .exists('Heatmap should contain day label - sun');
    assert.dom('[data-test-day-label-sun]').hasText('Sun');
  });

  test('it render heatmap node selector', async function (assert) {
    await render(hbs`<Heatmap />`);
    assert
      .dom('#insights-heatmap')
      .exists('Should exits heatmap node container for rendering heatmap');
  });
});
